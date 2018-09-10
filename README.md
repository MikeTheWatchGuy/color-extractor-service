# Color Palette extraction (as a service)

**[Live Demo](https://colors.rmotr.com/)**

<p align="center">
  <img src="https://user-images.githubusercontent.com/872296/45312271-04ce6f80-b502-11e8-9ce8-e46d76dd29c3.png">
</p>

This is a simple project to demonstrate the usage of unsupervised Machine Learning methods (clustering with [scikit-learn KMeans](http://scikit-learn.org/stable/modules/generated/sklearn.cluster.KMeans.html)) to extract colors from images.

## How it works

Theres a Jupyter Notebook with a step by step explanation in this same repo: [demo/Extract colors from images.ipynb](https://github.com/rmotr/color-extractor-service/blob/master/demo/Extract%20colors%20from%20images.ipynb)

## Usage

There's a simple API endpoint to use it as a service: `/api/extract`. It accepts two different types of requests:

##### Providing a URL

A JSON POST request with two parameters:
* `url` (**mandatory**): The URL of the picture to extract colors from
* `clusters` (optional): The number of clusters to use (default=6)

**Example:**

```bash
$ curl -X POST -d '{"url": "https://images.unsplash.com/photo-1536506591919-966afe6f7c09?fit=crop&w=750&q=80"}' -H "Content-Type: application/json" https://colors.rmotr.com/api/extract
```

##### Providing a File

A `multipart/form-data` request with two form values:
* `file` (**mandatory**): The image file to extract colors from
* `clusters` (optional): The number of clusters to use (default=6)

**Example:**

```bash
$ curl -X POST -F "file=@demo/sample-image-1.jpg" -F "clusters=7" http://localhost:5000/api/extract
```

#### Image Credit

Sample images from [unsplash](https://unsplash.com):

* https://unsplash.com/photos/PTDaKasR_p4
