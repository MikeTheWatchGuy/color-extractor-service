$(document).ready(function(){
  var previewNode = document.querySelector("#zdrop-template");
  var previewTemplate = previewNode.parentNode.innerHTML;
  previewNode.parentNode.removeChild(previewNode);

  // dropzone form
  var zdrop = new Dropzone('body', {
    url: '/extract',
    acceptedFiles: "image/*",
    headers: {
      'x-csrf-token': document.querySelectorAll('meta[name=csrf-token]')[0].getAttributeNode('content').value,
    },
    maxFiles: 1,
    maxFilesize: 30,
    thumbnailWidth: 200,
    thumbnailHeight: 200,
    previewTemplate: previewTemplate,
    previewsContainer: "#preview-container",
    clickable: "#fileupload-content",
    accept: function(file, done) {
      done();
    },
    init: function() {
      this.on("addedfile", function(file) {
        $('#preview-container img').css('visibility', 'visible');

        if (this.files[1]){
          this.removeFile(this.files[0]);
        }
      });

      this.on("sending", function(file, response) {
        // called before sending

        toggleLoader('show');
      });

      this.on("success", function(file, response) {
        // console.log("SUCCESS", file, response);
        makeChart(response.colors);
        toggleLoader('hide');

        // scroll to preview
        $('html, body').animate({
          scrollTop: $("#preview-container").offset().top
        }, 500);
      });

      this.on("error", function(file, response) {
        // console.log("ERROR", file, response);
        toggleLoader('hide');
      })
    }
  });

  // url form
  var urlForm = $('#url-form');
  urlForm.on("submit", function(event) {
    event.preventDefault();
    var isValid = urlForm.validate();

    if (isValid) {
      var imageURL = $('#image-url').val();
      isValidImageURL(imageURL).then(function(res) {
        if (res) {
          $('#preview-container').css('visibility', 'visible');

          var imgUrl = $('#image-url').val()
          var mockFile = {
            name: "image",
            status: Dropzone.ADDED,
            url: imgUrl
          };

          zdrop.files.push(mockFile);
          zdrop.emit("addedfile", mockFile);
          zdrop.emit("thumbnail", mockFile, imgUrl);
          zdrop.emit("sending", mockFile);

         $.ajax({
           type: "POST",
           dataType: "json",
           url: '/extract',
           data: {
             'url': imageURL
           },
           success: function(response, status){
             // console.log(response);
             zdrop.emit("success", mockFile, response);
           }
         })

          // zdrop.emit("complete", mockFile);
        } else {
          isValid.showErrors({ "image-url": "Please enter a valid image URL." });
        }
      });
    };
  });

  // add chart
  var makeChart = function(colorsObject) {
    var colors = Object.keys(colorsObject).map(function(key) {
      return key.toUpperCase();
    });
    var values = Object.keys(colorsObject).map(function(key) {
      return colorsObject[key]
    });
    var ctx = $("#chart");
    var pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        datasets: [{
          data: values,
          backgroundColor: colors
        }],
        labels: colors
      },
      options: {
        legend: {
           position: "right",
           labels: {
             fontColor: "#FFFFFF",
             fontSize: 13,
             fontStyle: "bold"
           },
           onClick: function(event, legendItem) {
             // console.log(legendItem.text);
             return event.stopPropagation()
           }
        },
      }
    });
  };

  // image url validation
  function isValidImageURL(url) {
    return new Promise(function(resolve, reject) {
      var timer, img = new Image();

      img.onerror = img.onabort = function() {
          clearTimeout(timer);
          resolve(false);
      };

      img.onload = function() {
           clearTimeout(timer);
           resolve(true);
      };

      timer = setTimeout(function() {
        resolve(false);
      }, 3000);

      img.src = url;
    });
  }
});

// toggle loader
var toggleLoader = function(action) {
  if (action == 'show') {
    $("#loader-container").show();
    $('body').css('overflow', 'hidden');
  }

  if (action == 'hide') {
    $("#loader-container").hide();
    $('body').css('overflow', 'initial');
  }
}
