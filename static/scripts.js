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
        console.log("sending");

        // TODO: add loader
      });

      this.on("success", function(file, response) {
        console.log("SUCCESS");
        console.log(response.colors);

        makeChart(response.colors);
      });

      this.on("complete", function(file, response) {
        console.log(response);

        // TODO: remove loader

        // makeChart();
      });
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

          // TODO: jquery.ajax

          zdrop.emit("complete", mockFile);
        } else {
          isValid.showErrors({ "image-url": "Please enter a valid image URL." });
        }
      });
    };
  });

  // add chart
  var makeChart = function(colors) {
    console.log(colors);

    var ctx = $("#chart");
    var pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        datasets: [{
          data: [10, 20, 30, 40],
          backgroundColor: [
            '#ff6384',
            '#36a2eb',
            '#cc65fe',
            '#ffce56',
          ]
        }],
        labels: [
          '#ff6384'.toUpperCase(),
          '#36a2eb'.toUpperCase(),
          '#cc65fe'.toUpperCase(),
          '#ffce56'.toUpperCase(),
        ]
      },
      options: {
        legend: {
           position: "right",
           labels: {
             fontColor: "#FFFFFF",
             fontSize: 13,
             fontStyle: "bold"
           },
           onClick: function(e, legendItem) {
             console.log(legendItem.text);
             return e.stopPropagation()
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

// $(function() {
//  // bind 'myForm' and provide a simple callback function
//  $('form').ajaxForm(function(data) {
//      console.log(data);
//  });
// });
