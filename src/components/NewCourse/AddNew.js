import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Button, Form, FormGroup, Label, Input } from "reactstrap";
import { useState } from "react";
import Calendar from "../Calendar";
import { FormText } from "reactstrap";
import DatePicker from "reactstrap-date-picker";
import LastCourse from "../../LastCourse";
import FirstView from "../Homepage/FirstView";
import { Redirect } from "react-router-dom";
import axios from "axios";

const ColoredLine = ({ color }) => (
  <hr
    style={{
      color: color,
      height: 0,
      marginLeft: 0,
      width: "1500px",
    }}
  />
);

// const regexImagePath = ({name})=> {
//   const regex = /\//;
//  const isValidRegex = (regex.test('name'));
// }

class AddNew extends Component {
  state = {
    redirectToNewPage: false,
  };

  constructor() {
    super();
    this.state = {
      title: "",
      duration: "",
      imagePath: "",
      open: false,
      instructors: [],
      description: "",
      dates: {
        start_date: "null",
        end_date: "null",
      },
      price: {
        normal: "",
        early_bird: "",
      },
      courses: [],
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value }, () => console.log(this.state));
  };

  handleChangeTitle = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value }, () => console.log(this.state));
    this.setState((prevState) => ({
      lastiId: prevState.courses[prevState.courses.length - 1].id,
    }));
  };

  handleChangeOpen = (event) => {
    this.setState((prevState) => ({
      open: !prevState.open,
    }));
  };

  handleChangeDateStart(value, formattedValue) {
    this.setState(({ dates }) => {
      dates["start_date"] = [];
      if (value) {
        dates.start_date = value.split("T")[0];
      }
      return dates;
    });
  }

  handleChangeDateEnd(value, formattedValue) {
    this.setState({
      value: value, // ISO String, ex: "2016-11-19T12:00:00.000Z"
      formattedValue: formattedValue, // Formatted String, ex: "11/19/2016"
    });
    this.setState(({ dates }) => {
      // let newInstructor = [...instructors];
      dates["end_date"] = [];
      dates.end_date = value.split("T")[0];
      return dates;
      //return { instructors: newInstructor };
    });
  }

  // handleChange = (event) => {
  //   const { name, value } = event.target;
  //   if(name === 'early_bird'){
  //     this.state.price.early_bird = value;
  //   }else if(name === 'normal'){
  //     this.state.price.normal = value;
  //   }
  //  // this.setState({ [name]: value }, () => console.log(this.state));
  //  this.setState(({ instructors }) => {
  //   let newInstructor = [...instructors];
  //   if (name === 'early_bird') {
  //     newInstructor = newInstructor.concat(value);
  //   } else {
  //     const index = newInstructor.indexOf(value);
  //     if (index > -1) {
  //       newInstructor.splice(index, 1);
  //     }
  //   }

  //   return { instructors: newInstructor };
  // });
  // };

  handleChangeCheckbox = (event) => {
    const value = event.target.value;
    const checked = event.target.checked;
    this.setState(({ instructors }) => {
      let newInstructor = [...instructors];
      if (checked) {
        newInstructor = newInstructor.concat(value);
      } else {
        const index = newInstructor.indexOf(value);
        if (index > -1) {
          newInstructor.splice(index, 1);
        }
      }

      return { instructors: newInstructor };
    });
  };

  handleChangePrice = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    this.setState(({ price }) => {
      if (name === "normal") {
        price["normal"] = [];
        price.normal = value;
      } else if (name === "early_bird") {
        price["early_bird"] = [];
        price.early_bird = value;
      }

      return price;
      //     return { instructors: newInstructor };
    });
  };
  //  handleSubmit = (event) => {
  //   //   //alert("Car: " + this.state.title);
  //   //   //alert("Car: " + this.state.duration);
  //      console.log(this.state);
  //      event.preventDefault();
  //         fetch('http://localhost:3001/courses', {
  //             method: 'POST',
  //             body:
  //              JSON.stringify({"title": this.state.title,
  //             "imagePath": this.state.price.imagePath,
  //             "price" : {"normal" : this.state.price.normal,
  //           "early_bird": this.state.early_bird},
  //             "dates" : {"start_date" : this.state.dates.start_date,
  //             "end_date": this.state.dates.end_date},
  //             "duration": this.state.duration,
  //       "open": this.state.open,
  //       "instructors": this.state.instructors,
  //       "description": this.state.description
  //           }
  //         )
  //         .then(response => response.json())
  //         // .then(user_id => this.setState({user: user_id}))
  //         // recID = recID.concat(this.state.user)
  //         // if (recID.length == 6) {
  //         //     this.setState({isLoggedIn: true})
  //         // }
  //       }
  //    };

  handleSubmit = (event) => {
    event.preventDefault();
    if (
      ((this.state.dates.start_date !== "null" &&
      this.state.dates.start_date !== "null") &&
      this.state.dates.start_date > this.state.dates.end_date)
    ) {
      alert("The start date can't be after the end date! Please try again");
    } else if (this.state.instructors.length === 0) {
      alert("You should select at least one instructor!");
    } else {
      fetch("http://localhost:3001/courses/", {
        method: "POST",
        body: JSON.stringify({
          id: this.state.lastiId.startsWith(0)
            ? 0 + (parseInt(this.state.lastiId) + 1).toString()
            : parseInt(this.state.lastiId) + 1,
          title: this.state.title,
          imagePath: this.state.imagePath,
          price: {
            normal: parseInt(this.state.price.normal),
            early_bird: parseInt(this.state.early_bird),
          },
          dates: {
            start_date: this.state.dates.start_date,
            end_date: this.state.dates.end_date,
          },
          duration: this.state.duration,
          open: this.state.open,
          instructors: this.state.instructors,
          description: this.state.description,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((response) => console.log("Success:", JSON.stringify(response)))
        .then(this.setState({ redirectToNewPage: true }))
        .catch((error) => console.error("Error:", error));
    }
  };

  componentDidMount() {
    this.setState({ isLoading: true });

    axios
      .get(`http://localhost:3001/courses`)
      .then((response) =>
        this.setState({ courses: response.data, isLoading: false })
      )
      .catch((error) => this.setState({ error, isLoading: false }));
  }

  render() {
    const { instructors } = this.state;
    // const { price } = this.state;
    //const { dates } = this.state;

    console.log(this.state);
    if (this.state.redirectToNewPage) {
      return <Redirect to="/" />;
    }
    return (
      <div style={{ marginTop: 30 }}>
        <Form
          style={{ marginLeft: "20px", marginTop: "10px" }}
          onSubmit={this.handleSubmit}
        >
          <h4>Add Course</h4>
          <FormGroup>
            <Label for="title" sm={2}>
              Title:
            </Label>
            <Col className="col-sm-10">
              <Input
                value={this.state.title}
                onChange={this.handleChangeTitle}
                type="text"
                name="title"
                id="title"
                placeholder="Title"
                required
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Label for="duartion" sm={2}>
              Duration:
            </Label>
            <Col className="col-sm-10">
              <Input
                value={this.state.duration}
                onChange={this.handleChange}
                type="text"
                name="duration"
                id="duration"
                placeholder="Duration"
                required
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Label for="image" sm={2}>
              Image path:
            </Label>
            <Col className="col-sm-10">
              <Input
                value={this.state.imagePath}
                onChange={this.handleChange}
                type="text"
                name="imagePath"
                id="imagePath"
                placeholder="Image path"
                required
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Label for="isBookable" sm={2}></Label>
            <Col sm={{ size: 12 }}>
              <FormGroup check>
                <Label check>
                  <Input
                    value={this.state.open}
                    onChange={this.handleChangeOpen}
                    type="checkbox"
                    name="isBookable"
                    id="isBookable"
                    checked={this.state.open}
                  />{" "}
                  Bookable
                </Label>
              </FormGroup>
            </Col>
          </FormGroup>
          <ColoredLine color="black" />
          <FormGroup tag="fieldset">
            <legend className="col-form-label col-sm-2">Instructors</legend>
            <Col sm={10}>
              <FormGroup check>
                <Label check>
                  <Input
                    value="01"
                    type="checkbox"
                    name="instructor01"
                    id="instructor01"
                    checked={instructors.includes("01")}
                    onChange={this.handleChangeCheckbox}
                  />{" "}
                  John Tsevdos
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input
                    value="02"
                    type="checkbox"
                    name="instructor02"
                    id="instructor02"
                    checked={instructors.includes("02")}
                    onChange={this.handleChangeCheckbox}
                  />{" "}
                  Yiannis Nikolakopoulos
                </Label>
              </FormGroup>
            </Col>
          </FormGroup>
          <ColoredLine color="black" />
          <FormGroup>
            <Label for="text" sm={2}>
              Description:
            </Label>
            <Col sm={10}>
              <Input
                value={this.state.description}
                onChange={this.handleChange}
                type="textarea"
                name="description"
                id="text"
                required
              />
            </Col>
          </FormGroup>
          <ColoredLine color="black" />
          <FormGroup tag="fieldset">
            <legend className="col-form-label col-sm-2">Dates</legend>
            <Col sm={10}>
              <FormGroup>
                <Label for="startDate" sm={2}>
                  Start date:
                </Label>
                <Col className="col-sm-10">
                  {/* <Input
                  // type="password"
                  name="startDate"
                  id="startDate"
                  placeholder="Start date"
                /> */}
                  {/* <FormGroup> */}
                  {/* <Label>My Date Picker</Label> */}
                  <DatePicker
                    id="startDate"
                    value={this.state.start_date}
                    onChange={(v, f) => this.handleChangeDateStart(v, f)}
                  />
                  <FormText>Help</FormText>
                  {/* </FormGroup> */}
                </Col>
              </FormGroup>
              <FormGroup>
                <Label for="endDate" sm={2}>
                  End date:
                </Label>
                <Col className="col-sm-10">
                  <DatePicker
                    id="endDate"
                    value={this.state.end_date}
                    onChange={(v, f) => this.handleChangeDateEnd(v, f)}
                  />
                </Col>
              </FormGroup>
            </Col>
          </FormGroup>
          <FormGroup tag="fieldset">
            <legend className="col-form-label col-sm-2">Price</legend>
            <Col sm={10}>
              <FormGroup>
                <Label for="earlyBird" sm={2}>
                  Early Bird:
                </Label>
                <Col className="col-sm-10">
                  <Input
                    value={this.state.price.early_bird}
                    onChange={this.handleChangePrice}
                    pattern="[0-9]\.\,"
                    type="number"
                    id="earlyBird"
                    placeholder="0"
                    name="early_bird"
                    required
                  />
                </Col>
              </FormGroup>
              <FormGroup>
                <Label for="normalPrice" sm={2}>
                  Normal price:
                </Label>
                <Col className="col-sm-10">
                  <Input
                    pattern="[0-9]\.\,"
                    type="number"
                    name="normal"
                    id="normalPrice"
                    placeholder="0"
                    value={this.state.price.normal}
                    onChange={this.handleChangePrice}
                    required
                  />
                </Col>
              </FormGroup>
              <ColoredLine color="black" />
            </Col>
          </FormGroup>
          <FormGroup style={{ paddingLeft: 1200 }} check row>
            <Col sm={{ size: 12, offset: 2 }}>
              <Button style={{ backgroundColor: "#3f51b5" }}>Add Course</Button>
            </Col>
          </FormGroup>
        </Form>
      </div>
    );
  }
}

export default AddNew;
