export interface Link {
  href: string;
}

export interface Links {
  self: Link;
  searchCollections: Link;
}

export interface LinksHolder {
  _links: Links;
}
