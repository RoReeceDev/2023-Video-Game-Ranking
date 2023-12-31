var upVote = document.getElementsByClassName("fa-arrow-up");
var downVote = document.getElementsByClassName("fa-arrow-down");
var rankTrash = document.getElementsByClassName("fa-trash");
var fav = document.getElementsByClassName("fa-star")

Array.from(upVote).forEach(function(element) {
      element.addEventListener('click', function(){
        const listItem = this.closest(".game")
        console.log(listItem)
        const title = listItem.querySelector(".title").textContent.trim()
        console.log(title)
        const studio = listItem.querySelector('.studio').textContent.trim()
        const upVote = parseFloat(listItem.querySelector(".up-votes").textContent)
        fetch('games', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'title': title,
            'studio': studio,
            'upVote': upVote
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          
          window.location.reload(true)
        })
      });
});

Array.from(downVote).forEach(function(element) {
  element.addEventListener('click', function(){
    const listItem = this.closest(".game")
    const title = listItem.querySelector(".title").textContent.trim()
    const studio = listItem.querySelector('.studio').textContent.trim()
    const downVote = parseFloat(listItem.querySelector(".down-votes").textContent)
    fetch('games/down', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'title': title,
        'studio': studio,
        'downVote': downVote
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
  });
});

Array.from(fav).forEach(function(element) {
  element.addEventListener('click', function(){
    const listItem = this.closest(".game")
    const title = listItem.querySelector(".title").textContent.trim()
    const studio = listItem.querySelector('.studio').textContent.trim()
    fetch('games/favorite', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'title': title,
        'studio': studio
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
     
      window.location.reload(true)
    })
  });
});

Array.from(rankTrash).forEach(function(element) {
      element.addEventListener('click', function(){
        const listItem = this.closest(".game")
        const title = listItem.querySelector(".title").textContent.trim()
        const studio = listItem.querySelector('.studio').textContent.trim()
        fetch('games', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'title': title,
            'studio': studio,
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
