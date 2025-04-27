require('dotenv').config();
const bcrypt = require('bcryptjs');
const { 
  User, 
  Track, 
  Playlist, 
  Artist, 
  Album, 
  Genre,
  sequelize,
  PlaylistTrack
} = require('../models');

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Check and create genres if they don't exist
    const genreNames = ['Rock', 'Pop', 'Hip Hop', 'Electronic', 'Jazz', 'R&B', 'Classical', 'Country'];
    const genreDescriptions = {
      'Rock': 'Rock music',
      'Pop': 'Pop music',
      'Hip Hop': 'Hip Hop music',
      'Electronic': 'Electronic music',
      'Jazz': 'Jazz music',
      'R&B': 'Rhythm and Blues',
      'Classical': 'Classical music',
      'Country': 'Country music'
    };

    const genres = [];
    for (const name of genreNames) {
      const [genre] = await Genre.findOrCreate({
        where: { name },
        defaults: { description: genreDescriptions[name] }
      });
      genres.push(genre);
    }
    console.log('Genres checked/created successfully');

    // Check and create artists if they don't exist
    const artistData = [
      { name: 'The Beatles', bio: 'British rock band', verified: true },
      { name: 'Michael Jackson', bio: 'King of Pop', verified: true },
      { name: 'Eminem', bio: 'Rap artist', verified: true },
      { name: 'Daft Punk', bio: 'French electronic music duo', verified: true },
      { name: 'Miles Davis', bio: 'Jazz trumpeter', verified: true },
      { name: 'Adele', bio: 'British singer-songwriter', verified: true },
      { name: 'Ed Sheeran', bio: 'British singer-songwriter', verified: true },
      { name: 'Taylor Swift', bio: 'American singer-songwriter', verified: true }
    ];

    const artists = [];
    for (const data of artistData) {
      const [artist] = await Artist.findOrCreate({
        where: { name: data.name },
        defaults: data
      });
      artists.push(artist);
    }
    console.log('Artists checked/created successfully');

    // Check and create albums if they don't exist
    const albumData = [
      { title: 'Abbey Road', artistId: artists[0].id, releaseDate: new Date('1969-09-26'), isPremium: false },
      { title: 'Thriller', artistId: artists[1].id, releaseDate: new Date('1982-11-30'), isPremium: false },
      { title: 'The Slim Shady LP', artistId: artists[2].id, releaseDate: new Date('1999-02-23'), isPremium: false },
      { title: 'Random Access Memories', artistId: artists[3].id, releaseDate: new Date('2013-04-19'), isPremium: true },
      { title: 'Kind of Blue', artistId: artists[4].id, releaseDate: new Date('1959-08-17'), isPremium: false },
      { title: '25', artistId: artists[5].id, releaseDate: new Date('2015-10-23'), isPremium: true },
      { title: '÷ (Divide)', artistId: artists[6].id, releaseDate: new Date('2017-01-06'), isPremium: false },
      { title: '1989', artistId: artists[7].id, releaseDate: new Date('2014-10-27'), isPremium: true }
    ];

    const albums = [];
    for (const data of albumData) {
      const [album] = await Album.findOrCreate({
        where: { 
          title: data.title,
          artistId: data.artistId
        },
        defaults: data
      });
      albums.push(album);
    }
    console.log('Albums checked/created successfully');

    // Check and create tracks if they don't exist
    const trackData = [
      // Rock tracks
      { 
        title: 'Come Together', 
        artistId: artists[0].id,
        artistName: artists[0].name,
        albumId: albums[0].id,
        albumName: albums[0].title,
        duration: 259,
        audioUrl: 'https://storage.googleapis.com/soundflow/tracks/come-together.mp3',
        coverArt: 'https://storage.googleapis.com/soundflow/covers/abbey-road.jpg',
        genre: 'Rock',
        releaseDate: new Date('1969-09-26'),
        isPremium: false
      },
      { 
        title: 'Let It Be', 
        artistId: artists[0].id,
        artistName: artists[0].name,
        albumId: albums[0].id,
        albumName: albums[0].title,
        duration: 243,
        audioUrl: 'https://storage.googleapis.com/soundflow/tracks/let-it-be.mp3',
        coverArt: 'https://storage.googleapis.com/soundflow/covers/abbey-road.jpg',
        genre: 'Rock',
        releaseDate: new Date('1970-03-06'),
        isPremium: true
      },
      { 
        title: 'Here Comes the Sun', 
        artistId: artists[0].id,
        artistName: artists[0].name,
        albumId: albums[0].id,
        albumName: albums[0].title,
        duration: 185,
        audioUrl: 'https://storage.googleapis.com/soundflow/tracks/here-comes-the-sun.mp3',
        coverArt: 'https://storage.googleapis.com/soundflow/covers/abbey-road.jpg',
        genre: 'Rock',
        releaseDate: new Date('1969-09-26'),
        isPremium: false
      },

      // Pop tracks
      { 
        title: 'Billie Jean', 
        artistId: artists[1].id,
        artistName: artists[1].name,
        albumId: albums[1].id,
        albumName: albums[1].title,
        duration: 294,
        audioUrl: 'https://storage.googleapis.com/soundflow/tracks/billie-jean.mp3',
        coverArt: 'https://storage.googleapis.com/soundflow/covers/thriller.jpg',
        genre: 'Pop',
        releaseDate: new Date('1982-11-30'),
        isPremium: false
      },
      { 
        title: 'Thriller', 
        artistId: artists[1].id,
        artistName: artists[1].name,
        albumId: albums[1].id,
        albumName: albums[1].title,
        duration: 357,
        audioUrl: 'https://storage.googleapis.com/soundflow/tracks/thriller.mp3',
        coverArt: 'https://storage.googleapis.com/soundflow/covers/thriller.jpg',
        genre: 'Pop',
        releaseDate: new Date('1982-11-30'),
        isPremium: true
      },
      { 
        title: 'Beat It', 
        artistId: artists[1].id,
        artistName: artists[1].name,
        albumId: albums[1].id,
        albumName: albums[1].title,
        duration: 258,
        audioUrl: 'https://storage.googleapis.com/soundflow/tracks/beat-it.mp3',
        coverArt: 'https://storage.googleapis.com/soundflow/covers/thriller.jpg',
        genre: 'Pop',
        releaseDate: new Date('1982-11-30'),
        isPremium: false
      },

      // Hip Hop tracks
      { 
        title: 'My Name Is', 
        artistId: artists[2].id,
        artistName: artists[2].name,
        albumId: albums[2].id,
        albumName: albums[2].title,
        duration: 268,
        audioUrl: 'https://storage.googleapis.com/soundflow/tracks/my-name-is.mp3',
        coverArt: 'https://storage.googleapis.com/soundflow/covers/slim-shady.jpg',
        genre: 'Hip Hop',
        releaseDate: new Date('1999-02-23'),
        isPremium: false
      },
      { 
        title: 'Lose Yourself', 
        artistId: artists[2].id,
        artistName: artists[2].name,
        albumId: albums[2].id,
        albumName: albums[2].title,
        duration: 326,
        audioUrl: 'https://storage.googleapis.com/soundflow/tracks/lose-yourself.mp3',
        coverArt: 'https://storage.googleapis.com/soundflow/covers/slim-shady.jpg',
        genre: 'Hip Hop',
        releaseDate: new Date('2002-10-28'),
        isPremium: true
      },
      { 
        title: 'Stan', 
        artistId: artists[2].id,
        artistName: artists[2].name,
        albumId: albums[2].id,
        albumName: albums[2].title,
        duration: 404,
        audioUrl: 'https://storage.googleapis.com/soundflow/tracks/stan.mp3',
        coverArt: 'https://storage.googleapis.com/soundflow/covers/slim-shady.jpg',
        genre: 'Hip Hop',
        releaseDate: new Date('2000-11-21'),
        isPremium: false
      },

      // Electronic tracks
      { 
        title: 'Get Lucky', 
        artistId: artists[3].id,
        artistName: artists[3].name,
        albumId: albums[3].id,
        albumName: albums[3].title,
        duration: 248,
        audioUrl: 'https://storage.googleapis.com/soundflow/tracks/get-lucky.mp3',
        coverArt: 'https://storage.googleapis.com/soundflow/covers/random-access.jpg',
        genre: 'Electronic',
        releaseDate: new Date('2013-04-19'),
        isPremium: true
      },
      { 
        title: 'One More Time', 
        artistId: artists[3].id,
        artistName: artists[3].name,
        albumId: albums[3].id,
        albumName: albums[3].title,
        duration: 320,
        audioUrl: 'https://storage.googleapis.com/soundflow/tracks/one-more-time.mp3',
        coverArt: 'https://storage.googleapis.com/soundflow/covers/random-access.jpg',
        genre: 'Electronic',
        releaseDate: new Date('2000-11-13'),
        isPremium: false
      },
      { 
        title: 'Harder, Better, Faster, Stronger', 
        artistId: artists[3].id,
        artistName: artists[3].name,
        albumId: albums[3].id,
        albumName: albums[3].title,
        duration: 224,
        audioUrl: 'https://storage.googleapis.com/soundflow/tracks/harder-better.mp3',
        coverArt: 'https://storage.googleapis.com/soundflow/covers/random-access.jpg',
        genre: 'Electronic',
        releaseDate: new Date('2001-10-13'),
        isPremium: true
      },

      // Jazz tracks
      { 
        title: 'So What', 
        artistId: artists[4].id,
        artistName: artists[4].name,
        albumId: albums[4].id,
        albumName: albums[4].title,
        duration: 565,
        audioUrl: 'https://storage.googleapis.com/soundflow/tracks/so-what.mp3',
        coverArt: 'https://storage.googleapis.com/soundflow/covers/kind-of-blue.jpg',
        genre: 'Jazz',
        releaseDate: new Date('1959-08-17'),
        isPremium: false
      },
      { 
        title: 'Blue in Green', 
        artistId: artists[4].id,
        artistName: artists[4].name,
        albumId: albums[4].id,
        albumName: albums[4].title,
        duration: 328,
        audioUrl: 'https://storage.googleapis.com/soundflow/tracks/blue-in-green.mp3',
        coverArt: 'https://storage.googleapis.com/soundflow/covers/kind-of-blue.jpg',
        genre: 'Jazz',
        releaseDate: new Date('1959-08-17'),
        isPremium: true
      },
      { 
        title: 'All Blues', 
        artistId: artists[4].id,
        artistName: artists[4].name,
        albumId: albums[4].id,
        albumName: albums[4].title,
        duration: 692,
        audioUrl: 'https://storage.googleapis.com/soundflow/tracks/all-blues.mp3',
        coverArt: 'https://storage.googleapis.com/soundflow/covers/kind-of-blue.jpg',
        genre: 'Jazz',
        releaseDate: new Date('1959-08-17'),
        isPremium: false
      },

      // Pop tracks (Adele)
      { 
        title: 'Hello', 
        artistId: artists[5].id,
        artistName: artists[5].name,
        albumId: albums[5].id,
        albumName: albums[5].title,
        duration: 295,
        audioUrl: 'https://storage.googleapis.com/soundflow/tracks/hello.mp3',
        coverArt: 'https://storage.googleapis.com/soundflow/covers/25.jpg',
        genre: 'Pop',
        releaseDate: new Date('2015-10-23'),
        isPremium: true
      },
      { 
        title: 'Someone Like You', 
        artistId: artists[5].id,
        artistName: artists[5].name,
        albumId: albums[5].id,
        albumName: albums[5].title,
        duration: 285,
        audioUrl: 'https://storage.googleapis.com/soundflow/tracks/someone-like-you.mp3',
        coverArt: 'https://storage.googleapis.com/soundflow/covers/25.jpg',
        genre: 'Pop',
        releaseDate: new Date('2011-01-24'),
        isPremium: false
      },
      { 
        title: 'Rolling in the Deep', 
        artistId: artists[5].id,
        artistName: artists[5].name,
        albumId: albums[5].id,
        albumName: albums[5].title,
        duration: 228,
        audioUrl: 'https://storage.googleapis.com/soundflow/tracks/rolling-in-the-deep.mp3',
        coverArt: 'https://storage.googleapis.com/soundflow/covers/25.jpg',
        genre: 'Pop',
        releaseDate: new Date('2010-11-29'),
        isPremium: true
      },

      // Pop tracks (Ed Sheeran)
      { 
        title: 'Shape of You', 
        artistId: artists[6].id,
        artistName: artists[6].name,
        albumId: albums[6].id,
        albumName: albums[6].title,
        duration: 234,
        audioUrl: 'https://storage.googleapis.com/soundflow/tracks/shape-of-you.mp3',
        coverArt: 'https://storage.googleapis.com/soundflow/covers/divide.jpg',
        genre: 'Pop',
        releaseDate: new Date('2017-01-06'),
        isPremium: false
      },
      { 
        title: 'Perfect', 
        artistId: artists[6].id,
        artistName: artists[6].name,
        albumId: albums[6].id,
        albumName: albums[6].title,
        duration: 263,
        audioUrl: 'https://storage.googleapis.com/soundflow/tracks/perfect.mp3',
        coverArt: 'https://storage.googleapis.com/soundflow/covers/divide.jpg',
        genre: 'Pop',
        releaseDate: new Date('2017-09-26'),
        isPremium: true
      },
      { 
        title: 'Thinking Out Loud', 
        artistId: artists[6].id,
        artistName: artists[6].name,
        albumId: albums[6].id,
        albumName: albums[6].title,
        duration: 281,
        audioUrl: 'https://storage.googleapis.com/soundflow/tracks/thinking-out-loud.mp3',
        coverArt: 'https://storage.googleapis.com/soundflow/covers/divide.jpg',
        genre: 'Pop',
        releaseDate: new Date('2014-09-24'),
        isPremium: false
      },

      // Pop tracks (Taylor Swift)
      { 
        title: 'Blank Space', 
        artistId: artists[7].id,
        artistName: artists[7].name,
        albumId: albums[7].id,
        albumName: albums[7].title,
        duration: 231,
        audioUrl: 'https://storage.googleapis.com/soundflow/tracks/blank-space.mp3',
        coverArt: 'https://storage.googleapis.com/soundflow/covers/1989.jpg',
        genre: 'Pop',
        releaseDate: new Date('2014-10-27'),
        isPremium: true
      },
      { 
        title: 'Shake It Off', 
        artistId: artists[7].id,
        artistName: artists[7].name,
        albumId: albums[7].id,
        albumName: albums[7].title,
        duration: 219,
        audioUrl: 'https://storage.googleapis.com/soundflow/tracks/shake-it-off.mp3',
        coverArt: 'https://storage.googleapis.com/soundflow/covers/1989.jpg',
        genre: 'Pop',
        releaseDate: new Date('2014-08-18'),
        isPremium: false
      },
      { 
        title: 'Style', 
        artistId: artists[7].id,
        artistName: artists[7].name,
        albumId: albums[7].id,
        albumName: albums[7].title,
        duration: 231,
        audioUrl: 'https://storage.googleapis.com/soundflow/tracks/style.mp3',
        coverArt: 'https://storage.googleapis.com/soundflow/covers/1989.jpg',
        genre: 'Pop',
        releaseDate: new Date('2014-10-27'),
        isPremium: true
      }
    ];

    const tracks = [];
    for (const data of trackData) {
      const [track] = await Track.findOrCreate({
        where: { 
          title: data.title,
          artistId: data.artistId,
          albumId: data.albumId
        },
        defaults: data
      });
      tracks.push(track);
    }
    console.log('Tracks checked/created successfully');

    // Check and create users if they don't exist
    const hashedPassword = await bcrypt.hash('password123', 10);
    const userData = [
      { 
        username: 'admin', 
        email: 'admin@soundflow.com', 
        password: hashedPassword,
        bio: 'System Administrator',
        isPremium: true,
        userType: 'admin'
      },
      { 
        username: 'john_doe', 
        email: 'john@example.com', 
        password: hashedPassword,
        bio: 'Music lover',
        isPremium: true
      },
      { 
        username: 'jane_smith', 
        email: 'jane@example.com', 
        password: hashedPassword,
        bio: 'Playlist creator',
        isPremium: false
      }
    ];

    const users = [];
    for (const data of userData) {
      const [user] = await User.findOrCreate({
        where: { email: data.email },
        defaults: data
      });
      users.push(user);
    }
    console.log('Users checked/created successfully');

    // Check and create playlists if they don't exist
    const playlistData = [
      { 
        name: 'Classic Rock Collection', 
        userId: users[0].id,
        description: 'A collection of timeless rock classics',
        isPublic: true
      },
      { 
        name: 'Pop Hits 2020s', 
        userId: users[1].id,
        description: 'Best pop songs of the 2020s',
        isPublic: true
      },
      { 
        name: 'Workout Mix', 
        userId: users[2].id,
        description: 'Songs to keep me motivated during workouts',
        isPublic: true
      }
    ];

    const playlists = [];
    for (const data of playlistData) {
      const [playlist] = await Playlist.findOrCreate({
        where: { 
          name: data.name,
          userId: data.userId
        },
        defaults: data
      });
      playlists.push(playlist);
    }
    console.log('Playlists checked/created successfully');

    // Add tracks to playlists
    const playlistTrackData = [
      { playlistId: playlists[0].id, trackId: tracks[0].id, order: 0 },
      { playlistId: playlists[0].id, trackId: tracks[1].id, order: 1 },
      { playlistId: playlists[1].id, trackId: tracks[5].id, order: 0 },
      { playlistId: playlists[1].id, trackId: tracks[6].id, order: 1 },
      { playlistId: playlists[1].id, trackId: tracks[7].id, order: 2 },
      { playlistId: playlists[2].id, trackId: tracks[1].id, order: 0 },
      { playlistId: playlists[2].id, trackId: tracks[3].id, order: 1 },
      { playlistId: playlists[2].id, trackId: tracks[6].id, order: 2 }
    ];

    for (const data of playlistTrackData) {
      await PlaylistTrack.findOrCreate({
        where: {
          playlistId: data.playlistId,
          trackId: data.trackId
        },
        defaults: data
      });
    }
    console.log('Tracks added to playlists successfully');

    // Add genres to tracks if not already added
    await tracks[0].addGenres([genres[0]]); // Rock
    await tracks[1].addGenres([genres[1]]); // Pop
    await tracks[2].addGenres([genres[2]]); // Hip Hop
    await tracks[3].addGenres([genres[3]]); // Electronic
    await tracks[4].addGenres([genres[4]]); // Jazz
    await tracks[5].addGenres([genres[1]]); // Pop
    await tracks[6].addGenres([genres[1]]); // Pop
    await tracks[7].addGenres([genres[1]]); // Pop
    console.log('Genres added to tracks successfully');

    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  seedDatabase();
} 