import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";


// const isProtectedRoute = createRouteMatcher([
//   '/',
//   '/upcoming',
//   '/meeting(.*)',
//   '/previous',
//   '/recordings',
//   '/personal-room',
// ]);

// export default clerkMiddleware((auth, req) => {
//   if (isProtectedRoute(req)) {
//     auth.protect();
//   }
// });
 

// const isIgnoredRoute = createRouteMatcher(
//     ['/sign-in', '/sign-up']
// )

// export default clerkMiddleware((auth, req) => {
//   if (isIgnoredRoute(req)) {
//     auth.protect();
//   }
// });



const isPublicRoute = createRouteMatcher([
    "/sign-in(.*)",
    "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) =>{
   
    if(!isPublicRoute(req)){
        await auth.protect();
    }
  
})


export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API + TRPC
    '/(api|trpc)(.*)',
  ],
};
