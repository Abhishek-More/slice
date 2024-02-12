# Slice

Check out the project on [Devpost](https://devpost.com/software/slice-m6zqpf)

## Inspiration
Over a **million** people use **American Sign Language (ASL)** to communicate as their native language in the US. In fact, ASL is the third most frequent language in the States behind English and Spanish! Not only is it important for people to be aware of the method of communication, but it is very helpful and even fun to learn. In addition, we came up with the idea during the actual hackathon when we witnessed hackers playing a type-racing game. Not only do we find the idea of **gamification** extremely interesting, but we also believe it serve as a potent delivery method to help people of all ages to learn about the language. Moreover, statistics illustrate an alarming trend in deafness: _'Hearing loss is the third most common chronic physical condition in the United States and is twice as prevalent as diabetes or cancer.'_ (Centers for Disease Control and Prevention). 

![Graph of Hearing Loss over Time](https://cdn.discordapp.com/attachments/1170777522724687872/1206300419194622042/Predicted-Rates-of-Hearing-Loss-1.png?ex=65db81cf&is=65c90ccf&hm=69b6ea1ea107031b2dd1bc3593ea75f26398833d257bfff7ef6daee34ba1b137&)

As such, we believe it is crucial to raise awareness about this issue through a fun and engaging way.

## What it does
**Machine Learning** is an incredible technology that allows us to analyze data and find trends to an equal or even higher degree than humans. We leverage this advancement, specifically deep learning, **neural networks**, and classification algorithms to allow computers the ability to analyze hand patterns and recognize them as ASL letters. This machine learning allows us to figure out what letters someone might be holding up and even determine a score for how well the person is performing the letter. 

![ASL Alphabet](https://cdn.discordapp.com/attachments/1170777522724687872/1206302939010830437/ASL_A-M_GallaudetUniversity_Wikicommons.png?ex=65db8428&is=65c90f28&hm=e1709c829858c6dfd5132e3f55d30ff1fe2b33f206b69e8287887d5fc33a4492&)

Then, we  create a **real-time multiplayer web browser game** that allows users to compete on their ASL signing skills! Through the practice and excitement of the activity, not only do the participants get to have fun, but they also develop their ability to sign as well as read and recognize symbols!

## How we built it
We utilize **Tensorflow.js** with much inspiration from _https://github.com/syauqy/handsign-tensorflow_ in order to leverage Tensorflow.js's built in handpose module for pose estimation. From this visualization and determining of locations of various finger joints, we were able to classify different ASL letters. While we were unable to utilize the standard ML algorithms and techniques that rely on Python because of the low-latency nature of our project's vision, with upwards of 85% accuracy, Tensorflow's accuracy of more than **83%** works well enough to serve as a guide for successful signing. 

![Tensorflow.js Hand Pose Performance](https://cdn.discordapp.com/attachments/1170777522724687872/1206305147706417182/image.png?ex=65db8637&is=65c91137&hm=7591789d7a4031420ede69962c7ccd7c09fdec76060455cbbd62476247cf60c5&)

Then, we utilized React to build out both the front and back ends of our project. In order to achieve real-time functionality, we leveraged an incredibly neat feature in **Google's Firestore Databases**. By utilizing a series of documents, we were able to manage different event states, players, scores, and miscellaneous variables that multiple different different computers/users could access with low latency. Finally through **p5.js** and a plethora of **CSS/HTML/Tailwind**, we created animations, art, and assets for our game in order to deliver a visually appealing experience for our audience.

## Challenges we ran into
Unfortuntely or fortunately, we were unable to come up with a solid idea for the first 12 hours of the hackathon. We kept on waffling between a few projects with ambiguous benefits and no real sustenance before we participated in the type-racing event held by the CodeRed organizers. Moreover, setting up the database schema proved to be a daunting first step. Our main challenge arose when dealing with the short timeframe while also attempting to streamline the low-latency of our multiplayer game. Luckily, we were able to clutch up at the last minute in order to not only achieve our goals but even surpass them through both our functionality and also the art.

![Our final product!](https://cdn.discordapp.com/attachments/1170777522724687872/1206307397555982438/Image_2-11-24_at_12.18_PM.jpeg?ex=65db884f&is=65c9134f&hm=339d8b0b245de67afe650fac492c562c3cf110ed1d5a47b0746b333bfd69537a&)

## Accomplishments that we're proud of
We're narcissistically proud of our art and assets all designed from scratch that we hope you enjoy. In addition, having the game run an impressive ML model quickly in the browser for the first time was certainly an "ah-hah" moment for us as a team.

## What we learned
Together we were able to learn more about how to use p5.js to create cool animations and movements. Moreover, we attempted Tensorflow.js for the first time, as opposed to our usual tech stack of Pytorch, Python, Flask!
