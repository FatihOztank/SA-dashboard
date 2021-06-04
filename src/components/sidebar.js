import React, {Fragment} from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import SidebarButton from "./SidebarButton";
import SASearchField from "./SASearchField";
import Legend from "./legend";

import { ReactComponent as FavoriteIcon} from "../assets/favorite.svg"
import { ReactComponent as ComparisonIcon} from "../assets/compare.svg"

import "../css/collapsible.css";
import "../css/sidebar.css";
import WelcomeDialog from "./WelcomeDialog";
import { addComparisonFeature, removeComparisonFeature } from "../redux/action-creators";
import LocationCompare from "./LocationToCompare";
import LocationDetails from "./LocationDetails";
import { Switch, Route } from "react-router";
import ComparisonSidebarContent from "./ComparisonSidebarContent";
import CollapsibleSection from "./CollapsibleSection";
import RecommendationDialog from "./RecommendationDialog";

class Sidebar extends React.Component {
  static propTypes = {
    select: PropTypes.object.isRequired,
    selectedFeature: PropTypes.object,
    comparisonFeatures: PropTypes.array.isRequired
  };
  
  render() {
    const {
      selectedFeature,
      comparisonFeatures,
    } = this.props;

    const PanelContainer = (props) => {
      const featureSelected = this.props.selectedFeature
        ? "featureSelected"
        : "noFeatureSelected";
      return (
        <div className={`panel-container ${featureSelected}`}>
          {props.children}
        </div>
      )
    }
    
    const isCompared = this.props.comparisonFeatures.find(feature => feature.properties["SA2_MAIN16"] === this.props.selectedFeature?.properties["SA2_MAIN16"]) !== undefined;
    const enableButton = this.props.comparisonFeatures.length >= 4;
    
    const comparisonClick = (feature) => {
      if (isCompared) {
        removeComparisonFeature(feature);
      } else {
        addComparisonFeature(feature);
      }
    }
    
    const ActionButtons = () => (
      <div className="actionButtonsContainer">
        <button className="actionButton"><FavoriteIcon className="icon"/> Add to Favorites</button>
        <button disabled={enableButton} className="actionButton" onClick={() => comparisonClick(this.props.selectedFeature)}>
          <ComparisonIcon className="icon"/>
          {isCompared ? "Remove from Comparison" : "Add to Comparison"}
        </button>
      </div>

    );
    // const featureDebug = (feature) => {
    //   if (!feature || !feature.properties) {
    //     return ""
    //   }
    //   return (
    //     <ul className="sidebar-content">
    //     {
    //       Object.keys(feature.properties).map((key) => (
    //         <li key={key}>{key}: {feature.properties[key]}</li>
    //       ))
    //     }
    //     </ul>
    //   )
    // }

    return (
      <PanelContainer>
        <SidebarButton />
        <div className={`sidebar-container`}>
          <Switch>
            <Route exact path="/comparison" render={() => (
              <ComparisonSidebarContent />
            )} />
            <Route render={() => (
              <>
                <SASearchField />
                {this.props.selectedFeature ?
                  <>
                    <ActionButtons/>
                    {comparisonFeatures.length > 0 &&
                      <CollapsibleSection title="Locations to Compare">
                        <LocationCompare showButton />
                      </CollapsibleSection>
                    }
                    <LocationDetails feature={selectedFeature} comparison={comparisonFeatures}>
                    </LocationDetails>
                  </>
                  :
                  <>
                    <WelcomeDialog />
                    <RecommendationDialog />
                    <Legend/>
                  </>
                }
              </>
            )}  />
          </Switch>
        </div>
      </PanelContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    select: state.select,
    selectedFeature: state.selectedFeature,
    comparisonFeatures: state.comparisonFeatures
  };
}

export default connect(mapStateToProps)(Sidebar);
