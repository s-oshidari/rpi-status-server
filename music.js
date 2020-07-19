const song_karada_dandan = require('./songs/karada_dandan');
const song_station = require('./songs/station');
const song_oni_no_pants_1 = require('./songs/oni_no_pants_1');
const song_oni_no_pants_2 = require('./songs/oni_no_pants_2');

const playlist = {
  karada_dandan: song_karada_dandan,
  // station: song_station,
  // oni_no_pants_1: song_oni_no_pants_1,
  // oni_no_pants_2: song_oni_no_pants_2,
};

module.exports = class Music {

  constructor(buzzer) {
    this.buzzer = buzzer;
  }

  play(songTitle) {
    const song = playlist[songTitle];
    this.buzzer.setBaseLength(song.baseLength);
    song.melody.forEach(sound => {
      this.buzzer.makeSound(sound.scale, sound.level, sound.length);
    });
  }

  playAny() {
    const songTitles = Object.keys(playlist);
    const index = Math.floor(Math.random() * songTitles.length);
    this.play(songTitles[index]);
  }

}
