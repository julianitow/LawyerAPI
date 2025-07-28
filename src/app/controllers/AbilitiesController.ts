import Router from "koa-router";
import { Context } from "vm";
import { IAbility } from "../../definitions/interfaces";
import { AbilityDAO, _AbilityDAO } from "../../platforms/mongo";
import { BaseController } from "./BaseController";
import { Application } from "..";
import * as Utils from "../../platforms/utils";
import NodeCache from "node-cache";

export class AbilitiesController extends BaseController {
    readonly path = "/abilities";
    private readonly abilityDAO: AbilityDAO;
    unsecuredRoutes = [`${this.path}/all`, `${this.path}/image`]
  
    constructor() {
      super();
      this.abilityDAO = _AbilityDAO;
    }

    async reorder(ctx: Context): Promise<void> {
      try {
        const abilities = ctx.request.body;
        for (const i in abilities) {
          abilities[i].indexOrder = i;
          this.abilityDAO.update(abilities[i]);
        }
        ctx.status = 204;
      } catch (err) {
        console.error("ERR_UPDT", err);
        ctx.status = 500;
      }
    }
  
    async updateAbility(ctx: Context): Promise<void> {
      try {
        const ability = ctx.request.body as IAbility;
        if (ability.image !== undefined) {
          ability.image.content = Buffer.from(ability.image.content); // convert uint8array to Buffer
        }
        this.abilityDAO.update(ability);
        ctx.status = 204;
      } catch (err) {
        console.error("ERR_UPDT", err);
        ctx.status = 500;
      }
    }
  
    async createAbility(ctx: Context): Promise<void> {
      try {
        const ability = ctx.request.body as IAbility;
        if (ability.image !== undefined) {
          ability.image.content = Buffer.from(ability.image.content); // convert uint8array to Buffer
        }
        ctx.body = await this.abilityDAO.create(ability);
        ctx.status = 201;
      } catch (err) {
        console.error("ERR_CREAT", err);
        ctx.status = 500;
      }
    }
  
    async deleteAbility(ctx: Context): Promise<void> {
      const abilityId = ctx.params.id as string;
      try {
        ctx.body = await this.abilityDAO.delete(abilityId);
        ctx.status = 200;
      } catch (err) {
        console.error("ERR_CREAT", err);
        ctx.status = 500;
      }
    }
  
    async fetchAllAbilities(ctx: Context): Promise<void> {
      try {
        const abilities = await this.abilityDAO.fetchAll(true);
        const cache = Application.sharedContext.cache as NodeCache;
        for (const ability of abilities) {
          let buffer = undefined;
          const image = ability.image;
          const cacheKey = `img-${image.id}`;
          if (cache.has(cacheKey)) {
            buffer = cache.get(cacheKey) as Buffer | Uint8Array;
            console.debug(`getting image: ${image.id} from cache`);
            if (Buffer.isBuffer(buffer) === false) {
              console.error('ERR: BUFFER IS NOT BUFFER: ', buffer);
              buffer = undefined;
            }
          }
          if (buffer === undefined) {
            buffer = await Utils.saveImageToContext(image, 10);
          }
          ability.image.content = buffer;
        }
        
        ctx.body = abilities.sort((a, b) => (b.indexOrder ?? 0) - (a.indexOrder ?? 0));
        ctx.status = 200;
      } catch (err) {
        console.error(err);
        ctx.status = 500;
      }
    }

    async fetchImage(ctx: Context): Promise<void> {
      const abilityId = ctx.query.id as string;
      try {
        const ability = await this.abilityDAO.fetchOne(abilityId);
        if (ability !== null) {
          ctx.body = ability.image.content;
          ctx.status = 200;
        } else {
          ctx.status = 404;
        }
      } catch(err) {
        console.error(err);
        ctx.status = 500;
      }
    }
  
    build(): Router {
      const router = super.build();
      /**
       * Abilities
       */
      router.get(
        `/all`,
        this.fetchAllAbilities.bind(this)
      );
      router.get(
        `/image`,
        this.fetchImage.bind(this)
      );
      router.post(
        `/create`,
        this.createAbility.bind(this)
      );
      router.patch(
        `/reorder`,
        this.reorder.bind(this)
      );
      router.patch(
        `/edit`,
        this.updateAbility.bind(this)
      );
      router.delete(
        `/delete`,
        this.deleteAbility.bind(this)
      );
      return router;
    }
  }