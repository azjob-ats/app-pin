import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ChannelApi } from '@shared/apis/channel.api';
import { Channel } from '@shared/interfaces/entity/channel';
import { CollectionBundle } from '@shared/interfaces/entity/collection-bundle';
import { Post } from '@shared/interfaces/entity/post';

@Injectable({ providedIn: 'root' })
export class ChannelService {
  private readonly channelApi = inject(ChannelApi);

  getByProfileName(profileName: string): Observable<Channel> {
    return this.channelApi.detail(profileName).pipe(map((response) => response.data!));
  }

  getGallery(profileName: string, page = 1, pageSize = 20): Observable<Post[]> {
    return this.channelApi
      .gallery(profileName, page, pageSize)
      .pipe(map((response) => response.data?.data ?? []));
  }

  getCollection(profileName: string, page = 1, pageSize = 20): Observable<CollectionBundle[]> {
    return this.channelApi
      .collection(profileName, page, pageSize)
      .pipe(map((response) => response.data?.data ?? []));
  }
}
