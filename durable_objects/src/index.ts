// In order for the workers runtime to find the class that implements
// our Durable Object namespace, we must export it from the root module.
export { StudentTracker } from './student-tracker'

export default {
  // this worker does not have any routes. it is only used to host durable objects.
}