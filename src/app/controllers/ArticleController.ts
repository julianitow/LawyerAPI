import { Context } from 'koa';
import Router from 'koa-router';
import { ArticleDAO, _ArticleDAO } from '../../platforms/mongo';
import { BaseController } from './BaseController';
import { IArticle } from '../../definitions/interfaces';
import { Application } from '../Application';
import NodeCache from 'node-cache';
import * as Utils from "../../platforms/utils";

export class ArticleController extends BaseController {
  readonly path = '/article';
  private readonly articleDAO: ArticleDAO;
  unsecuredRoutes?: string[] = ['/all', '/image'];

  constructor() {
    super();
    this.articleDAO = _ArticleDAO;
  }

  async update(ctx: Context): Promise<void> {
    try {
      const article = ctx.request.body as IArticle;
      if (article.image !== undefined) {
        article.image.content = Buffer.from(article.image.content); // convert uint8array to Buffer
      }
      this.articleDAO.update(article);
      ctx.status = 204;
    } catch (err) {
      console.error('ERR_UPDT', err);
      ctx.status = 500;
    }
  }

  async create(ctx: Context): Promise<void> {
    try {
      const article = ctx.request.body as IArticle;
      if (article.image !== undefined) {
        article.image.content = Buffer.from(article.image.content); // convert uint8array to Buffer
      }
      ctx.body = await this.articleDAO.create(article);
      ctx.status = 201;
    } catch (err) {
      console.error('ERR_CREAT', err);
      ctx.status = 500;
    }
  }

  async delete(ctx: Context): Promise<void> {
    const articleId = ctx.params.id as string;
    try {
      ctx.body = await this.articleDAO.delete(articleId);
      ctx.status = 200;
    } catch (err) {
      console.error('ERR_CREAT', err);
      ctx.status = 500;
    }
  }

  async fetchImage(ctx: Context): Promise<void> {
    const articleId = ctx.query.id as string;
    try {
      const article = await this.articleDAO.fetchOne(articleId);
      if (article !== null) {
        ctx.body = article.image?.content;
        ctx.set('Content-Type', 'image/jpeg');
        ctx.status = 200;
      } else {
        ctx.status = 404;
      }
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  }

  async fetchAll(ctx: Context): Promise<void> {
    try {
      const articles = await this.articleDAO.fetchAll(true);
      const cache = Application.sharedContext.cache as NodeCache;
      for (const ability of articles) {
        let buffer = undefined;
        if (ability.image === undefined) {
          throw new Error('Article image is undefined');
        }
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

      ctx.body = articles;
      ctx.status = 200;
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  }

  build(): Router {
    const router = super.build();
    router.get('/all', this.fetchAll.bind(this));
    router.get('/image', this.fetchImage.bind(this));
    router.post('/create', this.create.bind(this));
    router.patch('/edit', this.update.bind(this));
    router.delete('/delete/:id', this.delete.bind(this));
    return router;
  }
}
