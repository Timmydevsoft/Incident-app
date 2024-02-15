
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);


    // MY JS CODE STARTS HERE

    const formData = {}

    // PLUGINS CODE STARTS HERE

    const camaButton = document.getElementById("take-pics");
    const capturedImage = document.getElementById("plu-image");
    

   // Corrected the way you attach the event listener
    camaButton.addEventListener("click", butFunction);

    function butFunction() {
        var camera = navigator.camera;
    
        if (camera) {
            var options = {
                quality: 50,
                destinationType: camera.DestinationType.FILE_URI // Corrected the property access
            };
    
            navigator.camera.getPicture(cameraSuccess, cameraFail, options);
    
            function cameraSuccess(imageData) {
                // var image = document.getElementById("myImage");
                //image.src = "data:image/jpeg;base64," + imageData; // Corrected the concatenation
                    capturedImage.src = "data:image/jpeg;base64," + imageData;
            
            }
    
            function cameraFail(message) {
                alert('Failure message: ' + message); // Corrected the alert message
            }
        } else {
            alert('Camera not available.'); // Handle the case where the camera is not available
        }
    }

    formData.picsData = capturedImage.src.split(',')[1];
    let imData = formData.picsData;



    // GEOLOCATION PLUGIN CODE STARTS FROM HERE


    const geolationButton = document.getElementById("add-location");
   
    const lonG = document.getElementById("long");
    const laT = document.getElementById("lat")


    geolationButton.addEventListener("click", getLocation);
    function getLocation() {
        navigator.geolocation.getCurrentPosition(
            locationSuccess,
            locationError,
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    }

    const locationDat = {}


    function locationSuccess(position) {
        locationDat.latitude = position.coords.latitude;
        locationDat.longitude = position.coords.longitude;
    
        // Display the location in the result element
        laT.innerHTML = `${locationDat.latitude}`;
        lonG.innerHTML = `${locationDat.longitude}`;

        locationDat.lat = `${locationDat.latitude}`
        locationDat.long = `${locationDat.longitude}`;

    }

    
function locationError(error) {
    laT.innerHTML = `Error getting location: ${error.message}`;
}



    



    /*MY CODE STARTS HERE */

    const welcomePage = document.querySelector(".welcome-container");
    const blogRetrieved = document.querySelector(".view-blog-result-container");
    const postMakingPage = document.querySelector(".make-post-contaner");
    const form = document.querySelector(".fOrm");
    const postSuccessPage = document.querySelector(".sucess_message");

    // CODE TO NAVIGATE TO GET POST PAGE

    var postPageButton = document.getElementById("view-post");
    postPageButton.addEventListener("click", ()=>{
        welcomePage.classList.add("hide");
        document.querySelector(".view-blog-result-container").classList.add("show");
    })

    document.getElementById("to-home-page").addEventListener("click", ()=>{
        welcomePage.classList.remove("hide");
        document.querySelector(".view-blog-result-container").classList.remove("show");
    })

    // CODE TO NAVIGATE TO POST PAGE

    document.getElementById("make-post").addEventListener("click", ()=>{
        welcomePage.classList.add("hide");
        postMakingPage.classList.add("show");
        // form.classList.add("show");
        
    })

    

    
    /* form field input */

    // const fillField = document.querySelector(".fOrm");
    const username = document.getElementById("user-name");
    const titleOfPost = document.getElementById("content-title");
    const postContent = document.getElementById("post-content-oveview");
    
    
    
    form.addEventListener("submit", e => {
        e.preventDefault();
        verifyForm();
    });
    
    const verifyForm = () => {
        const usernameValue = username.value;
        if (usernameValue === '') {
            document.getElementById("error_user_name").style.display = "block";
            document.getElementById("user-name").classList.toggle("error");
            return;
        }
        formData.userName = usernameValue;

    
        const postTitleValue = String(titleOfPost.value);
        if (postTitleValue === '') {
            document.getElementById("error_title").style.display = "block";
            document.getElementById("content-title").classList.toggle("error");
            return;
        }
        formData.postTitle = postTitleValue;
    
        const postContentValue = String(postContent.value);
        if (postContentValue === '') {
            document.getElementById("error_content").style.display = "block";
            document.getElementById("post-content-oveview").classList.toggle("error");
            return;
        }
        formData.contentPost = postContentValue;

        console.log(formData);

        console.log(`LOCATION: <br> Latitude: ${ locationDat.lat}<br>Longitude: ${locationDat.long} <br>  ${formData.contentPost}`, formData.userName)


    };


    //let cOnTeNt = `LOCATION: <br> Latitude: ${ locationDat.lat}<br>Longitude: ${locationDat.long} <br>  ${formData.contentPost}`;



    

    document.getElementById("make-post-req").addEventListener('click',  ()=> {
        form.classList.add("hide");
        postSuccessPage.classList.add("show");
        getTokenAndCreatePost(formData.postTitle, `LOCATION: <br> Latitude: ${ locationDat.lat}<br>Longitude: ${locationDat.long} <br>  ${formData.contentPost}`)
    })


    // ... (your existing code)


    function getTokenAndCreatePost(postT, postC, imData, cat) {

        const Token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2JpbmNvbXRlYW0uMDAwd2ViaG9zdGFwcC5jb20iLCJpYXQiOjE3MDY2MjE3NzksIm5iZiI6MTcwNjYyMTc3OSwiZXhwIjoxNzA3MjI2NTc5LCJkYXRhIjp7InVzZXIiOnsiaWQiOiIxIn19fQ.N2glqtqKNXDypPOpRMNwHsvmoynxtk6miGN1wJWpjW4";
    
        const createPostEndpoint = 'https://bincomteam.000webhostapp.com/wp-json/wp/v2/posts';
    
       
        const postData = {
            title: postT,
            content: postC,
            status: 'publish',
            featured_media: ''
          };

          fetch (createPostEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Token}`
            },
            body: JSON.stringify({
                file: imData
            }),
          })

          .then(response => response.json())
          .then(uploadedImage => {
            
            postData.featured_media = uploadedImage.id;

           
            return fetch(createPostEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Token}`
                },
                body: JSON.stringify(postData)
            });


        })

        .then(response => response.json())
        .then(createdPost => {
            console.log('New post created successfully:', createdPost);
            document.getElementById("success").textContent = "SUCCESSFUL"
        })
        .catch(error => {
            console.error('Error creating new post:', error);
            document.getElementById("success").textContent = "FAILED";
        });


        
    }

    document.getElementById("back-to-welcome-from-post-success").addEventListener("click", ()=>{
        welcomePage.classList.remove("hide");
        postMakingPage.classList.remove("show");
    })


    // NOTIFICATION CODE

   

    // SEARCH BY CATEGORIES'S SUBMISSION AREA 

    

    const categ = document.getElementById("searc-input");
    
    // GET FUNCTION STARTS HERE

    
    const makePost = document.getElementById("get-post-request");
    makePost.addEventListener("click", ()=>{
        formData.category = categ.value;
        console.log (formData);
        getPosts(formData.category);
    })

    let apiUrl = "";

    const getPosts = (cat)=>{

        const CategorStatus = document.getElementById("category-status");
        const postsContainer = document.getElementById('post-contents-retrieved');

        if (cat === ''){
            apiUrl =  'https://bincomteam.000webhostapp.com/wp-json/wp/v2/posts';

            fetch(apiUrl)
            .then(response => response.json())
            .then(posts => {
            // Display posts in the container
             
             posts.forEach(post => {
                const postElement = createPostElement(post);
                 postsContainer.appendChild(postElement);
                });
            })

            .catch(error => {
                console.error('Error fetching posts:', error);
             });

        }

        else{
            
            apiUrl = `https://bincomteam.000webhostapp.com/wp-json/wp/v2/posts?categories=${cat}`;

            fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    console.error('Error fetching posts by category:', error);
                }
                return response.json();
            })

            .then(posts => {
                if (posts.length === 0) {
                    // Display message when no posts are found for the category
                 CategorStatus.innerHTML = `No posts found for the category: ${category}`;
                    
                } 
                
                else {

                    posts.forEach(post => {
                        
                        const postElementCategory = createPostElement(post);
                         postsContainer.appendChild(postElementCategory);
                        });
                    // Display the posts
                }

            })
            .catch(error => {
                // Display error message
                `Error: ${error.message}`;
                CategorStatus.innerHTML = "An error occour which might be due to invalid category" ;
            });


        }
    
    
       function createPostElement(post) {
        const postElement = document.createElement('div');
        postElement.className = 'post';
     
        const titleElement = document.createElement('h2');
        titleElement.className = 'post-title';
        titleElement.textContent = post.title.rendered;
     
        const contentElement = document.createElement('p');
        contentElement.className = 'post-content';
        contentElement.innerHTML = post.content.rendered;
     
        postElement.appendChild(titleElement);
        postElement.appendChild(contentElement);
     
        return postElement;
      }
    
    }


    // JS CODE ENDS HERE
  
}
