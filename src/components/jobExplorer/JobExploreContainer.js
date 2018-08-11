import React from 'react'
import JobFilter from './JobFilter'
import JobSearchResultList from './JobSearchResultList'
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../actions'
// import Select from 'react-select';
// import 'react-select/dist/react-select.css'

class JobExploreContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      textSearch: "",
      categorySelection: [],
      levelSelection: [],
      locationSelection: [],
      jobSearchResults: []
    }
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (prevState.jobSearchResults != this.state.jobSearchResults) {
  //     this.renderJobSearchResults
  //   }
  // }

  textSearchListener = (event) => {
    let input = event.target.value
    this.setState({
      textSearch: input
    })
  }

  categorySelectListener = (event) => {
    let categoryPicks = this.state.categorySelection.splice()
    let category=event.value
    if (event.value) {
      categoryPicks.push(category)
    }
    // else {
    //   categoryPicks.splice(categoryPicks.indexOf(category), 1)
    // }

    this.setState({
      categorySelection: categoryPicks
    })

  }

  levelSelectListener = (event) => {
    let levelPicks = this.state.levelSelection.slice()
    let level=event.target.value
    if (event.target.checked) {
      levelPicks.push(level)
    } else {
      levelPicks.splice(levelPicks.indexOf(level), 1)
    }

    this.setState({
      levelSelection: levelPicks
    })
  }

  locationSelectListener = (event) => {
    let locationPicks = this.state.locationSelection.slice()
    let location=event.target.value
    if (event.target.checked) {
      locationPicks.push(location)
    } else {
      locationPicks.splice(locationPicks.indexOf(location), 1)
    }

    this.setState({
      locationSelection: locationPicks
    })
  }

  handleJobSearchSubmit = (event) => {

    let categories = ""
    let levels = ""
    let locations = ""


    this.state.categorySelection.length > 0 ? categories = "&category=" + this.state.categorySelection.join("&category=") : categories = "";

    this.state.levelSelection.length > 0 ? levels = "&level=" + this.state.levelSelection.join("&level=") : levels = "";

    this.state.locationSelection.length > 0 ? locations = "&location=" + this.state.locationSelection.join("&location=") : locations = "";

    let currentResults = this.state.jobSearchResults.splice()
    console.log("in handleSubmitJobSearchResults")
    let i = 0


    // while (i < 3) {
      let jobUrl = "https://api-v2.themuse.com/jobs?" + categories + levels + locations + "&api-key=34298a48276984c821dcc75e585710fd5b77389f6379e7097f3ed52181571eb6&page=1"
      console.log("jobUrl", jobUrl)
      fetch(jobUrl)
      .then(response => response.json())
      // .then(json => json.results.map((res) => currentResults.push(res)))
      // .then(json => currentResults = [...json.results, ...currentResults ])
      .then(json => {
        console.log("json.results", json.results)
        console.log("currentResults", currentResults)
        currentResults = [...json.results, ...currentResults ]
        console.log("currentResults after spreadOperator", currentResults)
        // currentResults = this.resultsFiltered(currentResults)
        this.setState({
          jobSearchResults: currentResults
        }, this.renderJobSearchResults)
      })


      // }
      // currentResults.push(res))


    console.log(currentResults)
    //         i++
    // }


    // if (i >= 3) {
      // let textFiltered = this.resultsFiltered(currentResults)
      // console.log("after fetching - results", textFiltered)

    // }



  }

  resultsFiltered = (jobs) => {
    return jobs.filter((res) => {
      res.name.toLowerCase().includes(this.state.textSearch.toLowerCase()) || res.contents.toLowerCase().includes(this.state.textSearch.toLowerCase())
    })
  }

  renderJobSearchResults = () => {

    return <JobSearchResultList jobSearchResults = {this.state.jobSearchResults} savedJobs={this.props.savedJobs} addToSavedJobs={this.props.addToSavedJobs} />
  }

  render() {
    console.log("in render — jobSearchResults", this.state.jobSearchResults)

    return (
      <div className="jobSearchContainer">
        <h2>Search for a Job!</h2>

        <JobFilter textSearchListener={this.textSearchListener} categorySelection={this.state.categorySelection} categorySelectListener={this.categorySelectListener} levelSelectListener = {this.levelSelectListener} locationSelectListener={this.locationSelectListener} handleJobSearchSubmit={this.handleJobSearchSubmit} />

        <div className="searchContainerResults">

          {this.renderJobSearchResults()}

        </div>
      </div>
    )
  }

}

function mapStateToProps(state, props) {
  return {
    currentUser: state.user.currentUser,
    savedJobs: state.user.savedJobs,
    savedCompanies: state.user.savedCompanies,
    savedNotes: state.user.savedNotes,
    savedBookmarks: state.user.savedBookmarks,
    savedCategories: state.user.savedCategories,
    savedIndustries: state.user.savedIndustries
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(JobExploreContainer);
