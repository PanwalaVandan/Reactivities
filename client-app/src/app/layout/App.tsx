import React, { useEffect, Fragment, useContext } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { LoadingComponent } from "./LoadingComponent";
import ActivityStore from '../stores/activityStore';
import {observer} from 'mobx-react-lite';
// Removed as implementing react hooks
// interface IState {
//   activities: IActivity[];
// }

// class App extends Component<{}, IState> {
const App = () => {
  const activityStore = useContext(ActivityStore)

  useEffect(() => {
    activityStore.loadActivities();

    // telling useEffect about the dependency, that we are using activityStore
  }, [activityStore]);

  if(activityStore.loadingInitial) 
  return <LoadingComponent content='Loading activities...' />
  // Removed as implementing react hooks
  // readonly state: IState = {
  //   activities: [],
  // }

  // componentDidMount() {
  //   axios
  //   .get<IActivity[]>('http://localhost:5000/api/activities')
  //   .then((response) => {
  //     this.setState({
  //       activities: response.data
  //     })
  //   })
  // }

  // render() {
  //   return (
  //     <div>
  //       <Header as='h2'>
  //         <Icon name='plug' />
  //         <Header.Content>Reactivities</Header.Content>
  //       </Header>
  //       <List>
  //       {this.state.activities.map((activity) => (
  //             <List.Item key={activity.id}>
  //               {activity.title}
  //             </List.Item>
  //           ))}
  //       </List>
  //     </div>
  //   );
  // }

  return (
    <Fragment>
      <NavBar/>
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard/>
      </Container>
    </Fragment>
  );
};

export default observer(App);
