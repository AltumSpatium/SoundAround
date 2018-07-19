import { Howl, Howler } from 'howler';

class Player {
    constructor({playlist={}, onProgress}) {
        this._playlist = playlist;
        this._onProgress = onProgress;
        this._playingIndex = playlist.startIndex || 0;
        this._isPlaying = false;
        this._tracks = playlist.tracks ? this.initPlaylist(playlist) : [];
    }

    get isPlaying() {
        return this._isPlaying;
    }

    get playlist() {
        return this._playlist;
    }

    set playlist(playlist) {
        if (this._isPlaying) {
            this.stop();
        }

        this._playlist = playlist;
        this._tracks = playlist.tracks ? this.initPlaylist(playlist) : [];
        this._playingIndex = playlist.startIndex || 0;
    }

    initPlaylist(playlist) {
        const self = this;
        return playlist.tracks.map(track => new Howl({
            src: [track.src],
            html5: true,
            autoplay: false,
            onplay: () => {
                requestAnimationFrame(self.step.bind(self));
            },
            onloaderror: error => {
                console.log('Error:', error);
            }
        }));
    }

    step() {
        const trackHowl = this._tracks[this._playingIndex];

        if (this._onProgress) {
            const seek = trackHowl.seek() || 0;
            const percent = (((seek / trackHowl.duration()) * 100) || 0);
            this._onProgress(seek, percent);
        }

        const self = this;
        if (trackHowl.playing()) {
            requestAnimationFrame(self.step.bind(self));
        }
    }

    play(index) {
        if (this._isPlaying) {
            this.stop();
        }

        if (index !== undefined) this._playingIndex = index;
        const trackHowl = this._tracks[this._playingIndex];
        trackHowl.play();
        this._isPlaying = true;
        return this._playlist.tracks[this._playingIndex].id;
    }

    pause() {
        const trackHowl = this._tracks[this._playingIndex];
        trackHowl.pause();
        this._isPlaying = false;
    }

    stop() {
        const trackHowl = this._tracks[this._playingIndex];
        trackHowl.stop();
    }

    seek(percent) {
        const trackHowl = this._tracks[this._playingIndex];
        if (trackHowl.playing()) {
            trackHowl.seek(trackHowl.duration() * percent / 100);
        }
    }

    volume(value) {
        Howler.volume(value);
    }

    skipTo(index) {
        if (this._isPlaying) {
            this.seek(0);
            this.stop()
        }

        if (index < 0) index = 0;
        if (index >= this._tracks.length) index = this._tracks.length - 1;
        return this.play(index);
    }

    prev() {
        return this.skipTo(this._playingIndex - 1);
    }

    next() {
        return this.skipTo(this._playingIndex + 1);
    }
}

export default Player;
