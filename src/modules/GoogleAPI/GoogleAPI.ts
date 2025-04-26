import { IModule } from "../../definitions/interfaces";
import { google } from "googleapis";
import { GoogleAuth } from "google-auth-library";
import { IGoogleStatRow } from "../../definitions/interfaces/GoogleStat/IGoogleStatRow";

export class GoogleAPI implements IModule {
  private readonly credentialsPath = process.env.GOOGLE_CREDENTIALS;
  private readonly scopes = [
    "https://www.googleapis.com/auth/webmasters.readonly",
  ];
  private auth: GoogleAuth | undefined;
  private siteUrl = process.env.SITE_URL;

  static instance: GoogleAPI;

  private init(): void {
    this.authenticate();
  }

  private authenticate(): void {
    this.auth = new google.auth.GoogleAuth({
      keyFile: this.credentialsPath,
      scopes: this.scopes,
    });
  }

  private formatDate(date: Date): string {
    const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
    return `${date.getFullYear()}-${date.getMonth() + 1}-${day}`;
  }

  private async getSite() {
    try {
      const webmasters = google.webmasters({ version: "v3", auth: this.auth });
      const res = await webmasters.sites.list();
      const sites = res.data.siteEntry;

      if (sites !== undefined) {
        if (sites?.length > 0) {
          this.siteUrl = sites[0].siteUrl as string;
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  async getSearchAnalytics(
    from: Date | string,
    to: Date | string
  ): Promise<IGoogleStatRow[] | undefined> {
    const webmasters = google.webmasters({ version: "v3", auth: this.auth });
    if (from instanceof Date) {
      from = this.formatDate(from);
    }
    if (to instanceof Date) {
      to = this.formatDate(to);
    }

    const request = {
      siteUrl: this.siteUrl,
      requestBody: {
        startDate: from,
        endDate: to,
        dimensions: ["date"],
      },
    };

    const response = await webmasters.searchanalytics.query(request);
    return response.data.rows;
  }

  async default(): Promise<void> {
    if (this.credentialsPath === undefined) {
      console.warn(
        "Google credentials undefined, aborting use of GooleAPI Module"
      );
      return;
    }
    this.authenticate();
    await this.getSite();
    GoogleAPI.instance = this;
    // await this.getSearchAnalytics(new Date("10/01/2024"), new Date());
  }
}
