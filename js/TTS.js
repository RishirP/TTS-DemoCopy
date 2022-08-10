var polly = new AWS.Polly();
polly.deleteLexicon(params, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});
