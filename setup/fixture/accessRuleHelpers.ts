import {
  IncludedCollectionsAccessRule,
  IncludedVideosAccessRule,
  VideoTypes,
  ExcludedVideoTypesAccessRule,
  IncludedChannelsAccessRule,
} from './accessRule';

export function ltiIncludedCollectionsAccessRuleFixture(
  collectionIds: string[],
): IncludedCollectionsAccessRule {
  return {
    type: 'IncludedCollections',
    name: 'LTI Selected Collections',
    collectionIds,
  };
}

export function includedVideosAccessRuleFixture(
  videoIds: string[],
  name: string,
): IncludedVideosAccessRule {
  return {
    name,
    type: 'IncludedVideos',
    videoIds,
  };
}

export function includedChannelsAccessRuleFixture(
  channelIds: string[],
  name: string,
): IncludedChannelsAccessRule {
  return {
    name,
    type: 'IncludedChannels',
    channelIds,
  };
}

export function excludedVideoTypesAccessRuleFixture(
  videoTypes: VideoTypes[],
  name: string,
): ExcludedVideoTypesAccessRule {
  return {
    name,
    videoTypes,
    type: 'ExcludedVideoTypes',
  };
}
