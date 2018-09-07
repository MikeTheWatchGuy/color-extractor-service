$(function() {
 // bind 'myForm' and provide a simple callback function
 $('form').ajaxForm(function(data) {
     console.log(data);
 });
});
