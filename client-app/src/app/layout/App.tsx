import React, { useState, useEffect, Fragment, SyntheticEvent } from "react";
import { Container } from "semantic-ui-react";
import { IActivity } from "../models/activity";
import NavBar from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import agent from "../api/agent";
import { LoadingComponent } from "./LoadingComponent";
// Removed as implementing react hooks
// interface IState {
//   activities: IActivity[];
// }

// class App extends Component<{}, IState> {
const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);

  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  );

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const[target, setTarget] = useState('');

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter((a) => a.id === id)[0]);
    setEditMode(false);
  };

  const handleOpenCreateform = () => {
    setSelectedActivity(null);
    setEditMode(true);
  }

  const handleCreateActivity = (activity: IActivity) => {
    setSubmitting(true);
    agent.Activities.create(activity).then(() => {
        setActivities([...activities, activity])
        setSelectedActivity(activity);
        setEditMode(false);
      }).then(() => setSubmitting(false))
  }

  const handleEditActivity = (activity: IActivity) => {
    setSubmitting(true);
    agent.Activities.update(activity).then(
      () => {
        setActivities([...activities.filter(a => a.id !== activity.id), activity])
        setSelectedActivity(activity);
        setEditMode(false);
      }).then(() => setSubmitting(false))
  }

  const handleDeleteActivity = (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    setSubmitting(true);
    setTarget(event.currentTarget.name)
    agent.Activities.delete(id).then(
      () => {
        setActivities([...activities.filter(a => a.id !==id)])
      }).then(() => setSubmitting(false))
  }

  useEffect(() => {
    agent.Activities.list()
      .then((response) => {
        let activities: IActivity[] = [];
        response.forEach((activity) => {
          activity.date = activity.date.split('.')[0];
          activities.push(activity);
          })
        setActivities(activities);
      }).then(() => setLoading(false));
  }, []);

  if(loading) 
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
      <NavBar openCreateForm={handleOpenCreateform}/>
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
          activities={activities}
          selectActivity={handleSelectActivity}
          selectedActivity={selectedActivity}
          editMode={editMode}
          setEditMode={setEditMode}
          setSelectedActivity={setSelectedActivity}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
          target={target}
        />
      </Container>
    </Fragment>
  );
};

export default App;
