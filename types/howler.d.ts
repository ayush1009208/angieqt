declare module 'howler' {
    export class Howl {
        constructor(options: {
            src: string[];
            loop?: boolean;
            volume?: number;
            autoplay?: boolean;
        });
        play(): void;
        pause(): void;
        stop(): void;
    }
}
