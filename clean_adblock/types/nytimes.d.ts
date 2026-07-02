export interface NYTFormat {
  __typename: string;
}

export interface NYTInline {
  __typename: string;
  text?: string;
  formats?: NYTFormat[];
}

export interface NYTBlock {
  __typename: string;
  content?: NYTInline[];
}

export interface NYTData {
  initialData?: {
    data?: {
      article?: {
        sprinkledBody?: {
          content?: NYTBlock[];
        };
      };
    };
  };
}
