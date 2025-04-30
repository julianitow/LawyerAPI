import Router from "koa-router";
import { Context } from "vm";
import { IAbility } from "../../definitions/interfaces";
import { AbilityDAO, _AbilityDAO } from "../../platforms/mongo";
import { BaseController } from "./BaseController";

export class AbilitiesController extends BaseController {
    readonly path = "/abilities";
    private readonly abilityDAO: AbilityDAO;
    unsecuredRoutes = [`${this.path}/all`]
  
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
        ctx.body = await this.abilityDAO.fetchAll(true);
        ctx.status = 200;
      } catch (err) {
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