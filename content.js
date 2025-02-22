const bookmarkImgurl = chrome.runtime.getURL("assets/bookmark.png");
const AZ_Problem_Key = "AZ_Problem_Key";

const observer = new MutationObserver(() => {
    addBookmarkButton();
});
observer.observe(document.body, {childList: true, subtree: true});

addBookmarkButton();

function onProblemsPage(){
    return window.location.pathname.startsWith('/problems/');
}

function addBookmarkButton(){

    if(!onProblemsPage() || document.getElementById("add-bookmark-button")) return;

    const bookmarkButton = document.createElement('img');
    bookmarkButton.id = "add-bookmark-button";
    bookmarkButton.src = bookmarkImgurl;
    bookmarkButton.style.height = "30px";
    bookmarkButton.style.height = "30px";
    const ask_btn = document.getElementsByClassName("coding_ask_doubt_button__FjwXJ")[0];
    ask_btn.parentElement.insertAdjacentElement("afterend", bookmarkButton);
    bookmarkButton.addEventListener("click", addNewBookmarkHandler);
}

async function addNewBookmarkHandler(){
    const currentBookmark = await getcurrentBookMarkUrl();
    const azproblemurl = window.location.href;
    const uniqueid = extractProblemId(azproblemurl);
    const problemname = document.getElementsByClassName("Header_resource_heading__cpRp1")[0].innerText;

    for (const bookmark of currentBookmark || []) {
        if (bookmark.id === uniqueid) return;
    }
      
    const bookmarkobj = {
        id : uniqueid,
        name : problemname,
        url : azproblemurl
    }

    const newbookmarks = [...currentBookmark, bookmarkobj];

    chrome.storage.sync.set({AZ_Problem_Key:newbookmarks}, () =>{
        console.log("Updated the bookmark to ", newbookmarks);
    })
}

function extractProblemId(url) {
    const start = url.indexOf("problems/") + "problems/".length;
    const end = url.indexOf("?", start);
    return end === -1 ? url.substring(start) : url.substring(start, end);
}

function getcurrentBookMarkUrl(){
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get([AZ_Problem_Key], (results) => {
            resolve(results[AZ_Problem_Key] || []);
        });
    });
}