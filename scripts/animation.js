export function waitUntilAnimationsFinish(element) {

    //Pick all active CSS animations/transitions currently applied to 'element' and for each animation, pick its  Promise that will resolve once this animation finishes. Collect all such promises into the animationPromises array.

    const animationPromises = element.getAnimations().map(animation => animation.finished);
    //Therefore: animationPromises = [Promise, Promise, Promise,.....] where each Promise is an object.
    //Before animation finishes, a promise looks sth like Promise { <pending> }
    //Once animation finishes, the same promise looks like Promise { <fulfilled>: CSSAnimation }


    // Create and return one new “master” Promise that will only settle(means either fulfil or reject) when all the Promises in the array have fulfilled or rejected. 
    return Promise.allSettled(animationPromises);

}