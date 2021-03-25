DEV-BOON:

We are creating an extension which helps developers in increasing their productivity and also reduce their effort.


Visual Studio Code was ranked the most popular developer environment tool.(By StackOverFlow Developers survey 2019) 


There are around 18 million Questions and 27 million answers on StackOverflow.(As on 21st January,2020)


There are tens of thousands of YouTube channels and videos that are related to coding and development.


Developers spend a lot of time on StackOverFlow and also on YouTube(These days particularly).


We integrated Youtube and StackOverFlow into VisualStudioCode and Added many functionalities so that developers can use VisualStudioCode as a Full Fledged platform where they can code ,solve issues with the help of Youtube Videos and StackOverFlow posts.


We have the following features in our Extension for this Release:
        Search Query
        Error Query
        Snippet Query
        Difficult Query
        
        
Search Query :
Users Can search for their Query directly on our extension’s search box by pressing “Ctrl+Shift+Q”. Then user will be given an option ( StackOverFlow or YouTube)
Users can also search for the query selected(hovered) on the editor by pressing “Ctrl+Shift+S” for StackOverFlow posts or “Ctrl+Shift+Y” for YouTube videos.



Error Query
Whenever User encounters an error ( compilation error , runtime error etc ) while executing a program , we will automatically detect that and we will show the relevant StackOverFlow posts or YouTube Videos.{ This feature is only implemented for Python and Java }



Difficult Query
We closely monitor users activity on the Editor and we take the number of Insertion / Deletions / Scroll Events / Click Events made by user and if we detect that user is stuck in some part( By taking ratios of insertions , deletions and other events ) or user is idle ( for more than 10 minutes) , We recommend him some videos or Posts and also prompt the user to take help of our extension.


Snippet Query : 
Whenever User wants a piece of code for some task , User can simply Write an ‘English’ sentence enclosed in between “?” and “?” and press “Ctrl+Shift+N”. We will automatically paste the relevant code snippet from StackOverFlow in the Editor where the cursor is currently positioned ( along with the link for that code as comment ). We will automatically detect the programming language and paste the relevant code.
