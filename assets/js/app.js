const cl = console.log;

const showHideMovieModalBtn = document.getElementById("showHideMovieModalBtn");
const backdrop = document.getElementById("backdrop");
const movieModal = document.getElementById("movieModal");
const movieModalCloseIcon = document.getElementById("movieModalCloseIcon");
const movieModalCloseBtn = document.getElementById("movieModalCloseBtn");
const movieContainer = document.getElementById("movieContainer");
const form = document.getElementById("form");
const movieName = document.getElementById("movieName");
const movieImg = document.getElementById("movieImg");
const movieDescription = document.getElementById("movieDescription");
const movieRating = document.getElementById("movieRating");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");

// Database

let jsonArr = localStorage.getItem("movieArray");

let movieArray = jsonArr ? JSON.parse(jsonArr) : [];

// functions

// SaveData

function saveDataLS() {
  localStorage.setItem("movieArray", JSON.stringify(movieArray));
}

// Show Hide Movie Modal & backdrop

function showhideMovieModal() {
  backdrop.classList.toggle("active");
  movieModal.classList.toggle("active");
}

// Rating

function setRating(rating) {
  if (rating > 7) {
    return "badge-success";
  } else if (rating > 5 && rating <= 7) {
    return "badge-warning";
  } else {
    return "badge-danger";
  }
}

// Read

function showOnUI(arr) {
  let result = "";

  arr.forEach((ele) => {
    result += `
                <div class="col-md-3 mb-3">
                <div class="card movieCard" id="${ele.id}">

                    <div class="card-header d-flex justify-content-between">
                        <h4 class="m-0">${ele.original_title}</h4>
                        <h5 class="m-0"><span class="badge ${setRating(ele.vote_average)}">${ele.vote_average}</span></h5>
                    </div>

                    <div class="card-body py-0">
                        <figure class="m-0">
                            <img src="https://image.tmdb.org/t/p/w500${
                              ele.poster_path || ele.backdrop_path
                            }" alt="${ele.original_title}">
                            <figcaption>
                                <h4 class="m-0">${ele.original_title}</h4>
                                <p>${ele.overview}</p>
                            </figcaption>
                        </figure>
                    </div>

                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="editMovie(this)" class="btn btn-sm net-pri-btn">Edit</button>
                        <button onclick="removeMovie(this)" class="btn btn-sm net-sec-btn">Remove</button>
                    </div>
                </div>
            </div>
        `;
  });

  movieContainer.innerHTML = result;
}

showOnUI(movieArray);

// Create

function onMovieAdd(event) {
  event.preventDefault();

  if (
    !movieName.value.trim() ||
    !movieImg.value.trim() ||
    !movieDescription.value.trim() ||
    !movieRating.value.trim()
  ) {
    Swal.fire({
      title: "Ooops!!!",
      text: "Please fill in all the required fields.",
      icon: "warning",
      timer: 2000,
    });
    return;
  }

  let newMovie = {
    id: crypto.randomUUID(),
    original_title: movieName.value.trim(),
    poster_path: movieImg.value.trim(),
    overview: movieDescription.value.trim(),
    vote_average: movieRating.value,
  };

  movieArray.push(newMovie);
  saveDataLS();

  //   UI

  let div = document.createElement("div");

  div.id = newMovie.id;

  div.className = `col-md-3 mb-3`;

  div.innerHTML = `
         <div class="card movieCard" id="${newMovie.id}">

                    <div class="card-header d-flex justify-content-between">
                        <h4 class="m-0">${newMovie.original_title}</h4>
                        <h5 class="m-0"><span class="badge ${setRating(newMovie.vote_average)}">${newMovie.vote_average}</span></h5>
                    </div>

                    <div class="card-body py-0">
                        <figure class="m-0">
                            <img src="https://image.tmdb.org/t/p/w500${
                              newMovie.poster_path || newMovie.backdrop_path
                            }" alt="${newMovie.original_title}">
                            <figcaption>
                                <h4 class="m-0">${newMovie.original_title}</h4>
                                <p>${newMovie.overview}</p>
                            </figcaption>
                        </figure>
                    </div>

                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="editMovie(this)" class="btn btn-sm net-pri-btn">Edit</button>
                        <button onclick="removeMovie(this)" class="btn btn-sm net-sec-btn">Remove</button>
                    </div>
                </div>
  `;
  movieContainer.prepend(div);
  showhideMovieModal();
  form.reset();

  Swal.fire({
    title: "Created!",
    text: "Movie Card has been Created Successfully.",
    icon: "success",
    timer: 2000,
  });
}

// edit Movie

function editMovie(ele) {
  showhideMovieModal();
  let editId = ele.closest(".movieCard").id;
  localStorage.setItem("editId", editId);
  let editObj = movieArray.find((ele) => String(ele.id) === editId);

  movieName.value = editObj.original_title;
  movieImg.value = editObj.poster_path;
  movieDescription.value = editObj.overview;
  movieRating.value = editObj.vote_average;

  submitBtn.classList.add("d-none");
  updateBtn.classList.remove("d-none");
}

// update Movie

function onUpdateClick(event) {
  let updateId = localStorage.getItem("editId");

  if (
    !movieName.value.trim() ||
    !movieImg.value.trim() ||
    !movieDescription.value.trim() ||
    !movieRating.value.trim()
  ) {
    Swal.fire({
      title: "Ooops!!!",
      text: "Please fill in all the required fields.",
      icon: "warning",
      timer: 2000,
    });
    return;
  }

  let updatedObj = {
    id: updateId,
    original_title: movieName.value.trim(),
    poster_path: movieImg.value.trim(),
    overview: movieDescription.value.trim(),
    vote_average: movieRating.value,
  };

  let getIndex = movieArray.findIndex((ele) => String(ele.id) === updateId);
  if (getIndex === -1) return;

  movieArray[getIndex] = updatedObj;
  saveDataLS();

  let col = document.getElementById(updateId).parentElement;

  col.innerHTML = `
       <div class="card movieCard" id="${updatedObj.id}">

                    <div class="card-header d-flex justify-content-between">
                        <h4 class="m-0">${updatedObj.original_title}</h4>
                        <h5 class="m-0"><span class="badge ${setRating(updatedObj.vote_average)}">${updatedObj.vote_average}</span></h5>
                    </div>

                    <div class="card-body py-0">
                        <figure class="m-0">
                            <img src="https://image.tmdb.org/t/p/w500${
                              updatedObj.poster_path || updatedObj.backdrop_path
                            }" alt="${updatedObj.original_title}">
                            <figcaption>
                                <h4 class="m-0">${updatedObj.original_title}</h4>
                                <p>${updatedObj.overview}</p>
                            </figcaption>
                        </figure>
                    </div>

                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="editMovie(this)" class="btn btn-sm net-pri-btn">Edit</button>
                        <button onclick="removeMovie(this)" class="btn btn-sm net-sec-btn">Remove</button>
                    </div>
                </div>
  `;

  updateBtn.classList.add("d-none");
  submitBtn.classList.remove("d-none");
  localStorage.removeItem("editId");
  showhideMovieModal();
  form.reset();

  Swal.fire({
    title: "Updated!",
    text: "Movie Card has been Updated Successfully.",
    icon: "success",
    timer: 2000,
  });
}

// Remove Movie

function removeMovie(ele) {
  let removeId = ele.closest(".movieCard").id;

  Swal.fire({
    title: "Are you sure?",
    text: "You want to delete this Movie Card!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      let getIndex = movieArray.findIndex((ele) => String(ele.id) === removeId);
      if (getIndex === -1) return;

      movieArray.splice(getIndex, 1);
      saveDataLS();

      ele.closest(".movieCard").parentElement.remove();

      Swal.fire({
        title: "Deleted!",
        text: "Movie Card has been deleted Successfully.",
        icon: "success",
        timer: 2000,
      });
    }
  });
}

showHideMovieModalBtn.addEventListener("click", showhideMovieModal);
movieModalCloseIcon.addEventListener("click", showhideMovieModal);
movieModalCloseBtn.addEventListener("click", showhideMovieModal);
backdrop.addEventListener("click", showhideMovieModal);
form.addEventListener("submit", onMovieAdd);
updateBtn.addEventListener("click", onUpdateClick);
