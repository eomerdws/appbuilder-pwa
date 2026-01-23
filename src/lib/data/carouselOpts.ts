export interface CarouselOpts {
    id: number;
    items: Object | Array<any>;
    imageFolder?: string;
    onclickCallback: (event: Event, item: any) => {};
    checkImageSizeCallback: (item: any) => {};
    // Siema Specific options
    perPage?: number;
    loop?: boolean;
    startIndex?: number;
    draggable?: boolean;
    multipleDrag?: boolean;
    threshold?: number;
    rtl?: boolean;
    selector?: string;
}
