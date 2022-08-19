//The URIs of the REST endpoint
IUPS =
  "https://prod-10.centralus.logic.azure.com:443/workflows/f590c1fa0542411b8b6b86e6f93736fc/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=gKLzeKPt2XLRV0kqtM2HsafoJ0LxXbSTHWQHysOOiY4";
RAI =
  "https://prod-26.centralus.logic.azure.com:443/workflows/47a4afdc8d074f4895a61930fb184b5e/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Egkdvd9K49AtXaDqqjzuuHFemrVuQ7KuF-tPnr7LgX0";

BLOB_ACCOUNT = "https://assignblob.blob.core.windows.net";

DIAURI0 =
  "https://prod-01.centralus.logic.azure.com/workflows/db5c9153d78d42799510f51569642c34/triggers/manual/paths/invoke/";
DIAURI1 =
  "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ZoDyjUguPlupM7AN3dIk0A-rgIuiN41yZ8D_Il7_cIA";

//Handlers for button clicks
$(document).ready(function () {
  $("#retImages").click(function () {
    //Run the get asset list function
    getImages();
  });

  $("#retaudio").click(function () {
    //Run the get asset list function
    getmp3();
  });

  //Handler for the new asset submission button
  $("#subNewForm").click(function () {
    //Execute the submit new asset function
    submitNewAsset();
  });
});

//A function to submit a new asset to the REST endpoint
function submitNewAsset() {
  //Create a form data object
  submitData = new FormData();

  //Get form variables and append them to the form data object
  submitData.append("filename", $("#filename").val());
  submitData.append("userID", $("#userID").val());
  submitData.append("username", $("#username").val());
  submitData.append("File", $("#UpFile")[0].files[0]);

  //Post the form data  to the endpoint, note the need to set the content type header
  $.ajax({
    url: IUPS,
    data: submitData,
    cache: false,
    enctype: "multipart/form-data",
    contentType: false,
    processData: false,
    type: "POST",
    success: function (data) {},
  });
}

//A function to get a list of all the assets and write them to the Div with the AssetList Div
function getImages() {
  //Replace the current HTML in that div with a loading message
  $("#ImageList").html(
    '<div class="spinner-border" role="status"><span class="sr-only"> &nbsp;</span>'
  );

  $.getJSON(RAI, function (data) {
    //Create an array to hold all the retrieved assets
    var items = [];

    //Iterate through the returned records and build HTML, incorporating the key values of the record in the data
    $.each(data, function (key, val) {
      items.push("<hr  />");
      items.push(
        "<img src='" + BLOB_ACCOUNT + val["filepath"] + "'width='400'/> <br/>"
      );
      items.push("File : " + val["filename"] + "<br/>");
      items.push(
        "Uploaded by: " +
          val["username"] +
          " (user id: " +
          val["userID"] +
          ")<br />"
      );
      // items.push(
      //   '<button type="button" id="subNewForm" class="btn btn-danger"  onclick="deleteAsset(' +
      //     val["id"] +
      //     ')">DELETE</button> <br/><br/>'
      // );
      items.push(
        '<button id="button" type="button" class="btn btn-danger" onclick="deleteAsset(\'' +
          val["filelocator"] +
          "')\">Delete</button>"
      );
      items.push("<hr  />");
    });

    //Clear the assetlist div
    $("#ImageList").empty();

    //Append the contents of the items array to the ImageList Div
    $("<ul/>", {
      class: "my-new-list",
      html: items.join(""),
    }).appendTo("#ImageList");
  });
}

//try and get mp3 to show
function getmp3() {
  //Replace the current HTML in that div with a loading message
  $("#audioList").html(
    '<div class="spinner-border" role="status"><span class="sr-only"> &nbsp;</span>'
  );

  $.getJSON(RAI, function (data) {
    //Create an array to hold all the retrieved assets
    var items2 = [];

    //Iterate through the returned records and build HTML, incorporating the key values of the record in the data
    $.each(data, function (key, val) {
      items2.push("<hr  />");
      items2.push(
        "<audio src='" + BLOB_ACCOUNT + val["filepath"] + "'width='400'/> <br/>"
      );
      items2.push("File : " + val["filename"] + "<br/>");
      items2.push(
        "Uploaded by: " +
          val["username"] +
          " (user id: " +
          val["userID"] +
          ")<br />"
      );

      items2.push("<hr  />");
    });

    //Clear the assetlist div
    $("#audioList").empty();

    //Append the contents of the items array to the ImageList Div
    $("<ul/>", {
      class: "my-new-list",
      html: items.join(""),
    }).appendTo("#audioList");
  });
}

//A function to delete an asset with a specific ID.
//The id paramater is provided to the function as defined in the relevant onclick handler
function deleteAsset(filelocator) {
  $.ajax({
    type: "GET",
    //Note the need to concatenate the del uri
    url: DIAURI0 + filelocator + DIAURI1,
  }).done(function (msg) {
    //On success, update the assetlist.
    location.reload();
  });
}
// function deleteImage(filelocator){
//   $.ajax({
//     type: "DELETE",
//     url: https://prod-50.eastus.logic.azure.com/workflows/067d7543c9c946c48ce699f564d3f5ab/triggers/manual/paths/invoke/${id}?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=of6C5793JgQ0_eq92nROg79cI4YRpmHIZMHB5J4XOuo
//   }).done(function( msg ){
//     getImages();
//   });
// }
