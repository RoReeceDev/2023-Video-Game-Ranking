const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

const url = "mongodb+srv://roreecedev:week11project@2023gameoftheyear.i3mtf4b.mongodb.net/?retryWrites=true&w=majority";
const dbName = "2023GamesofTheYear";

app.listen(4000, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('games').find().toArray((err, result) => {
    result.forEach((doc) => {
      doc.score = doc.upVote - doc.downVote;
    });
    result.sort((a, b) => b.score - a.score);
    if (err) return console.log(err)
    res.render('index.ejs', {games: result})
  })
})



app.post('/games', (req, res) => {
  console.log(req)
  db.collection('games').insertOne({title: req.body.title, studio: req.body.studio, coverImg: req.body.image, upVote: 0, downVote:0, favorite: false}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})


app.put('/games/favorite', (req, res) => {
  const title = req.body.title;
  const studio = req.body.studio;

  db.collection('games')
    .findOne({ title, studio }, (err, game) => {
      if (err) return res.send(err);

      const newFavoriteState = !game.favorite; // Toggle the favorite state

      db.collection('games')
        .findOneAndUpdate({ title, studio }, {
          $set: {
            favorite: newFavoriteState
          }
        }, {
          sort: { _id: -1 },
          upsert: true
        }, (err, result) => {
          if (err) return res.send(err);
          res.send(result);
        });
    });
});




// app.put('/messages/favorite', (req, res) => {
//   db.collection('games')
//   .findOneAndUpdate({title: req.body.title, studio: req.body.studio}, {
//     $set: {
//       favorite:true
//     }
//   }, {
//     sort: {_id: -1},
//     upsert: true
//   }, (err, result) => {
//     if (err) return res.send(err)
//     res.send(result)
//   })
// })

app.put('/games', (req, res) => {
  db.collection('games')
  .findOneAndUpdate({title: req.body.title, studio: req.body.studio}, {
    $set: {
      upVote:req.body.upVote + 1
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.put('/games/down', (req, res) => {
  db.collection('games')
  .findOneAndUpdate({title: req.body.title, studio: req.body.studio}, {
    $set: {
      downVote:req.body.downVote + 1
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/games', (req, res) => {
  db.collection('games').findOneAndDelete({title: req.body.title, studio: req.body.studio}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Game deleted!')
  })
})
