const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fetcher');

let repoSchema = mongoose.Schema({
  github_id: {type: Number, unique: true},
  name: String,
  username: String,
  url: String,
  description: String,
  created_at: Date,
  updated_at: Date,
  size: Number,
  stargazers: Number,
  watchers: Number,
  forks: Number,
  open_issues: Number,
});

let Repo = mongoose.model('Repo', repoSchema);

let save = (data) => {

  let mongoData = [];
  data.forEach(d => {
    let m = {};
    m.github_id = d.id;
    m.name = d.name;
    m.username = d.owner.login;
    m.url = d.html_url;
    m.description = d.description;
    m.created_at = d.created_at;
    m.updated_at = d.updated_at;
    m.size = d.size;
    m.stargazers = d.stargazers_count;
    m.watchers = d.watchers_count;
    m.forks = d.forks_count;
    m.open_issues = d.open_issues;
    mongoData.push(m);
  })
  // console.log('database save data', mongoData);
  // TODO: Your code here
  // This function should save a repo or repos to
  // the MongoDB

  return Repo.insertMany(mongoData, {ordered: false});
}

let retrieve = () => {
  var count = 0;

  return Repo.estimatedDocumentCount()
  .then(data => {
    count = data;
    return Repo.find({}, null, {sort: {size: -1} , limit: 25});
  }).then(data => {
    return [count, data];
  })

}

module.exports.save = save;
module.exports.retrieve = retrieve;