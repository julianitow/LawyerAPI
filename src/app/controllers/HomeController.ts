import { Context } from "koa";
import Router from "koa-router";
import { AbilityDAO, _AbilityDAO } from "../../platforms/mongo";
import { BaseController } from "./BaseController";
import { IAbility } from "../../definitions/interfaces";

export class HomeController extends BaseController {
  readonly path = "/home";
  readonly abilitiesSubPath = "/abilities";
  private readonly abilityDAO: AbilityDAO;
  unsecuredRoutes?: string[] = [`${this.abilitiesSubPath}/all`];

  constructor() {
    super();
    this.abilityDAO = _AbilityDAO;
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
      ctx.body = await this.abilityDAO.fetchAll();
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
      `${this.abilitiesSubPath}/all`,
      this.fetchAllAbilities.bind(this)
    );
    router.post(
      `${this.abilitiesSubPath}/create`,
      this.createAbility.bind(this)
    );
    router.patch(
      `${this.abilitiesSubPath}/edit`,
      this.updateAbility.bind(this)
    );
    router.delete(
      `${this.abilitiesSubPath}/delete`,
      this.deleteAbility.bind(this)
    );
    return router;
  }
}
