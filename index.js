//"Producing code" is code that can take some time
//"Consuming code" is code that must wait for the result
//A Promise is a JavaScript object that links producing code and consuming code

//async and await make promises easier to write
//async makes a function return a Promise
//await makes a function wait for a Promise
async function getUser(name){
    const api=await fetch(`https://api.github.com/users/${name}`);
    const res=await api.json();    
    return res;
}

async function getRepos(profile){
    const api=await fetch(`${profile.repos_url}`);
    let repos=await api.json();
    //console.log(repos);
    return repos;
}

document.querySelector('#search').addEventListener('submit',async (e)=>{
    e.preventDefault();
    let name=document.querySelector('#findByUsername').value;

    if(name.length>0){
        document.querySelector('.loader').style.display='block';
        let profile=await getUser(name);
        document.querySelector('.loader').style.display='none';

        if(profile.message==='Not Found'){
            document.querySelector('.notFound').style.display='block';
            document.querySelector('.profile').style.display='none';
            document.querySelector('.repositories').style.display='none';
        }else{            
            let repos=await getRepos(profile);            
            document.querySelector('.notFound').style.display='none';
            document.querySelector('.profile').style.display='block';
            document.querySelector('.repositories').style.display='block';
            showUser(profile);
            showRepos(repos);
        }        
    }    
});

function showRepos(repos){
    let htmlCode='';
    for (const repo of repos) {
        htmlCode+=`
        <div class="repo">
        <div class="repo_name">
          <a href="#">${repo.name}</a>
        </div>
        <p>
          <span class="circle"></span>${repo.language}
          <ion-icon name="star-outline"></ion-icon>${repo.stargazers_count}
          <ion-icon name="git-branch-outline"></ion-icon>${repo.forks}
        </p>
      </div>      
        `;
    }
    document.querySelector('.repos').innerHTML=htmlCode;
}

function showUser(profile){
    document.querySelector('.profile').innerHTML=`
    <img src="${profile.avatar_url}" alt="letstrie"/>
    <p class="name">${profile.name}</p>
    <p class="username login">${profile.login}</p>
    <p class="bio">${profile.bio}</p>

    <div class="followers-stars">
      <p>
        <ion-icon name="people-outline"></ion-icon>
        <span class="followers"> ${profile.followers} </span> followers
      </p>
      <span class="dot">·</span>
      <p><span class="following"> ${profile.following} </span> following</p>
    </div>

    <p class="company">
      <ion-icon name="business-outline"></ion-icon> ${profile.company}
    </p>
    <p class="location">
      <ion-icon name="location-outline"></ion-icon>${profile.location}
    </p>    
    `;
}
