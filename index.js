
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
import { tweetsData } from './data.js'

let newTweets = JSON.parse(localStorage.getItem("newTweets")) || []
let allTweets = [ ...newTweets, ...tweetsData]

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.dataset.deleteBtn){
        handleDelete(e.target.dataset.deleteBtn)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.id === 'submit'){
        e.preventDefault()
        handleReplySubmit(e.target.dataset.replyinput)
    }
   
})

function handleReplySubmit(tweetId) {
     let replyInput = document.getElementById(`reply-input${tweetId}`).value
    let tweet = allTweets.find(tweet => tweet.uuid === tweetId);
if (tweet && replyInput) {
    tweet.replies.unshift({
        handle: `@Scrimba`,
        profilePic: `images/scrimbalogo.png`,
        tweetText: replyInput,
    });
    localStorage.setItem("newTweets", JSON.stringify(newTweets)); // Save to localStorage
}
    render()
    document.getElementById(`replies-${tweetId}`).classList.toggle('hidden')
    }
    
    
//     let replyInput = document.getElementById(`reply-input${tweetId}`).value
//     allTweets.forEach(function(tweet) {
//         if(tweet.uuid === tweetId) {
//                 if(replyInput) {
//                 tweet.replies.unshift({
//                     handle: `@Scrimba`,
//                     profilePic: `images/scrimbalogo.png`,
//                     tweetText: replyInput,
//                 })
//             }
//         }
//     })
//     render()
//     document.getElementById(`replies-${tweetId}`).classList.toggle('hidden')
// }

function handleDelete(tweetId) {
    allTweets = allTweets.filter(tweet => tweet.uuid !== tweetId);
    newTweets = newTweets.filter(tweet => tweet.uuid !== tweetId);
    localStorage.setItem("newTweets", JSON.stringify(newTweets));
    render();
}


function handleLikeClick(tweetId){ 
    const targetTweetObj = allTweets.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    
    localStorage.setItem("newTweets", JSON.stringify(newTweets))
    
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = allTweets.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted 
    localStorage.setItem("newTweets", JSON.stringify(newTweets))
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        let newTweet = ({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
        
        newTweets.unshift(newTweet)
        localStorage.setItem("newTweets", JSON.stringify(newTweets))
        allTweets.unshift(newTweet)
    render()
    tweetInput.value = ''
    }

}

function getFeedHtml(){
    let feedHtml = ``
    
    allTweets.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`  
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
        let replyInput = `
            <input class="reply-input" id="reply-input${tweet.uuid}" />
            <input type="button" value="enter" id="submit" data-replyinput="${tweet.uuid}">
        `
    
        
        
          
        feedHtml += `
<div class="tweet">
    <p 
    class="delete-btn" 
    id="delete-btn"
    data-delete-btn="${tweet.uuid}"
    >
        x
    </p>
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${replyInput}
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

