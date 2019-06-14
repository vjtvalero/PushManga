import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [InAppBrowser]
})
export class HomePage implements AfterViewInit {
  selectedManga = '';
  selectedPage = 'latest';

  baseUrl = 'https://push-manga.herokuapp.com';
  newBaseUrl = 'https://viayensii.website/push-manga/api';
  // baseUrl = 'http://localhost:4000';
  baseMangaUrl = 'https://readms.net';

  mangas = [];
  chapters = [];
  latest = [];

  mangasResult = [];

  constructor(
    private http: HttpClient,
    private iab: InAppBrowser,

  ) { }

  ngAfterViewInit() {
    this.http.get(`${this.newBaseUrl}/mangas.php`).subscribe((response: any) => {
      this.mangas = response;
      this.mangasResult = response;
    });

    this.http.get(`${this.newBaseUrl}/latest.php`).subscribe((response: any) => {
      this.latest = response;
      this.latest.forEach((c) => {
        this.getThumbnail(c);
      });
    });
  }

  segmentChanged(event: any) {
    this.selectedPage = event.detail.value;
  }

  selectManga(url: string) {
    let mangaKeyword = url.split("/").pop();
    this.selectedManga = mangaKeyword.split("_").join(" ");
    this.http.get(`${this.baseUrl}/manga/chapters/${mangaKeyword}`).subscribe((response: any) => {
      this.chapters = response;
      this.chapters.forEach((c) => {
        c.url = this.baseMangaUrl + c.url;
        this.getThumbnail(c);
      });
    });
  }

  openChapter(url: string) {
    const browser = this.iab.create(url, '_system');
  }

  getThumbnail(chapter: any) {
    this.http.get(
      `${this.baseUrl}/manga/thumbnail/${encodeURIComponent(chapter.url)}`,
      { responseType: 'text' }
    ).subscribe((response: any) => {
      chapter.thumbnail = response;
    });
  }

  searchManga(e: any) {
    let keyword: string = e.detail.value;

    if (!keyword || keyword == '') {
      this.mangasResult = this.mangas;
    } else {
      this.mangasResult = this.mangas.filter(m => {
        return m.mangaTitle.toLowerCase().includes(keyword.toLowerCase());
      });
    }
  }
}
