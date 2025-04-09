import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    runtime: {
      type: Number,
      required: true
    },
    movieId: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const WatchList = mongoose.model('Watchlist', watchlistSchema);

export default WatchList;
