<?php
if(empty($_POST['name'])  		||
   empty($_POST['email']) 		||
   empty($_POST['message'])	||
   !filter_var($_POST['email'],FILTER_VALIDATE_EMAIL))
   {
	echo "No arguments Provided!";
	return false;
   }
	
$name = strip_tags(htmlspecialchars($_POST['name']));
$email_address = strip_tags(htmlspecialchars($_POST['email']));
$message = strip_tags(htmlspecialchars($_POST['message']));
	
$to = 'nasko.daskalov@abv.bg'; 
$email_subject = "HighlightsToWatch.com Contact form:  $name";
$email_body = "You have received a new message from HighlightsToWatch.com contact form.\n\n"."Here are the details:\n\nName: $name\n\nEmail: $email_address\n\n\nMessage:\n$message";
$headers = "From: $email_address\n"; 
$headers .= "Reply-To: $email_address";	
mail($to,$email_subject,$email_body,$headers);
return true;			
?>
