import { tweetsData } from './data.js'

import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

render()

document.addEventListener('click', function(e){
    
    if (e.target.dataset.like) {
        handleLikeClick(e.target.dataset.like)
    } else if (e.target.dataset.retweet) {
        handleRetweetClick(e.target.dataset.retweet)
    } else if (e.target.dataset.reply) {
        handleReplyClick(e.target.dataset.reply)
    } else if (e.target.id === 'tweet-btn') {
        handleTweetBtnClick()
    } else if (e.target.dataset.replyTweet) {
        handleTweetReplyClick(e.target.dataset.replyTweet)
    } else if (e.target.dataset.remove) {
        handleDeleteTweet(e.target.dataset.remove)
    }
    

})

function handleLikeClick(tweetId) {
    const targetTweetObject = tweetsData.filter(function(tweet) {
        return tweet.uuid.includes(tweetId)
    })[0]

    if (targetTweetObject.isLiked) {
        targetTweetObject.likes-- 
    } else {
        targetTweetObject.likes++
    }

    targetTweetObject.isLiked = !targetTweetObject.isLiked
    render()
}

function handleRetweetClick(tweetId) {
    const targetTweetObject = tweetsData.filter(function(tweet) {
        return tweet.uuid.includes(`${tweetId}`)
    })[0]

    if (targetTweetObject.isRetweeted) {
        targetTweetObject.retweets--
    } else {
        targetTweetObject.retweets++ 
    }
    targetTweetObject.isRetweeted = !targetTweetObject.isRetweeted
    render()
    
}

function handleTweetBtnClick() {

    const tweetInput = document.getElementById('tweet-input')

    if (tweetInput.value) {
        let userTweet = {}
        userTweet = {
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            isTweetedByUser: true,
            uuid: uuidv4()
        }
        tweetsData.unshift(userTweet)
        render()
        tweetInput.value = ''
    }
    
}

function handleTweetReplyClick(selectedfTweet) {
    const replyTextArea = document.getElementById(`reply-text-area-${selectedfTweet}`)
    let tweetReply = {}

    if (replyTextArea.value) {
        tweetReply = {
                handle: `@Scrimba`,
                profilePic: `images/scrimbalogo.png`,
                tweetText: replyTextArea.value,
        }
        tweetsData.forEach(function(tweet) {
          if (tweet.uuid.includes(`${selectedfTweet}`)) {
            tweet.replies.unshift(tweetReply)
            render()
          }
            
        })
        
    }
}

function handleReplyClick(replyId) {
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleDeleteTweet(tweetId) {
    const targetTweet = tweetsData.filter(function(tweet) {
        return tweet.uuid.includes(`${tweetId}`)
    })[0]
        const index = tweetsData.indexOf(targetTweet)
        if (index > -1) {
            tweetsData.splice(index, 1) 
        }
        
        render()

}

function getFeedHtml(){
    let feedHtml = ``

    tweetsData.forEach(function(tweet){
        let heartIconClass = ''
        let sharedIconClass = ''

        if (tweet.isLiked) {
            heartIconClass = 'liked'
        }
        if (tweet.isRetweeted) {
            sharedIconClass = 'retweeted'
        }

        let deleteTweet = ''

        if (tweet.isTweetedByUser === true) {
            deleteTweet = `<i class="fa-solid fa-trash" data-remove=${tweet.uuid}></i>`
        }

        let repliesHtml = ''

        if (tweet.replies.length > 0) {
            tweet.replies.forEach(function(tweetReply) {
                repliesHtml += `
                        <div class="tweet-reply">
                            <div class="tweet-inner">
                                <img src="${tweetReply.profilePic}" class="profile-pic">
                                <div>
                                        <p class="handle">${tweetReply.handle}</p>
                                        <p class="tweet-text">${tweetReply.tweetText}</p>
                                    </div>
                                </div>
                        </div>`
            })
        }


        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}"></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${heartIconClass}" data-like="${tweet.uuid}"></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${sharedIconClass}" data-retweet="${tweet.uuid}"></i>
                    ${tweet.retweets}
                </span>
                <span>
                    ${deleteTweet}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
    <div>
    <textarea class="reply-text-area" id="reply-text-area-${tweet.uuid}" placeholder="reply..."> </textarea>
    <div class="btn-container">
        <button class="reply-btn" id="reply-btn" data-reply-tweet="${tweet.uuid}" >Reply</button>
    </div>
    </div>
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