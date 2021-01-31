import { CommentStream, SubmissionStream } from 'snoostorm';
import Snoowrap from 'snoowrap';

const creds = require('./credentials.json');

const client = new Snoowrap(creds);

const startTime = new Date().getTime() / 1000;

console.log('startTime', startTime);

const { subreddit, submitterUserName, replyMessage } = creds;

console.log(subreddit, submitterUserName);

// Options object is a Snoowrap Listing object, but with subreddit and pollTime options
const comments = new CommentStream(client, {
  subreddit,
  limit: 100,
  pollTime: 15000,
});
comments.on('item', (item) => {
  if (item.created_utc < startTime) console.log('==== OLD =====');

  console.log(item.author.name);
  console.log(item.created_utc, startTime);

  if (item.created_utc > startTime && item.author.name !== submitterUserName) {
    console.log('SENDING REPLY');
    console.log(item.link_permalink);
    item.reply(replyMessage);
  }
});

const submissions = new SubmissionStream(client, {
  subreddit,
  limit: 100,
  pollTime: 2000,
});
submissions.on('item', (item) => {
  if (item.created_utc > startTime) {
    console.log('SENDING REPLY TO SUBMISSION');
    console.log(item.permalink);
    item.reply(replyMessage);
  }
  console.log(item);

  // console.log(item.title);
  // console.log(item.permalink);
});
