export type AccessRuleType =
  | 'IncludedCollections'
  | 'IncludedVideos'
  | 'ExcludedVideoTypes'
  | 'IncludedChannels';

export interface AccessRuleFixture {
  type: AccessRuleType;
  name: string;
}

export interface IncludedCollectionsAccessRule extends AccessRuleFixture {
  collectionIds: string[];
  type: 'IncludedCollections';
}

export interface IncludedVideosAccessRule extends AccessRuleFixture {
  videoIds: string[];
  type: 'IncludedVideos';
}

export type VideoTypes = 'NEWS' | 'STOCK' | 'INSTRUCTIONAL';
export interface ExcludedVideoTypesAccessRule extends AccessRuleFixture {
  videoTypes: VideoTypes[];
  type: 'ExcludedVideoTypes';
}

export interface IncludedChannelsAccessRule extends AccessRuleFixture {
  channelIds: string[];
  type: 'IncludedChannels';
}
