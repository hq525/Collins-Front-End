import React, { useState, useEffect } from "react";
import SliderInput from "./Components/SliderInput";
import { Grid, CircularProgress, Button } from '@material-ui/core';
import { ENDPOINT } from "../utils/config";
import API from "../utils/API";

export default function RangeEdit(props) {
  const [loading, setLoading] = useState(true);
  const [OEEPoints, setOEEPoints] = useState({
    start: 20,
    end: 50
  });
  const [availabilityPoints, setAvailabilityPoints] = useState({
    start: 20,
    end: 50
  });
  const [performancePoints, setPerformancePoints] = useState({
    start: 20,
    end: 50
  });
  const [qualityPoints, setQualityPoints] = useState({
    start: 20,
    end: 50
  });
  const [DERPoints, setDERPoints] = useState({
    start: 20,
    end: 50
  });
  const [WIPPoints, setWIPPoints] = useState({
    start: 0,
    end: 50,
    startLimit: 0,
    endLimit: 100
  });
  useEffect(() => {
    let promises = [];
    let api = new API();
    promises.push(new Promise((resolve, reject) => {
      api
      .post(`${ENDPOINT}/range/get`, {
          name: "OEE"
      })
      .then((data) => {
        setOEEPoints({
          ...OEEPoints,
          start: data.range.start,
          end: data.range.end
        })
        resolve();
      })
      .catch((error) => {
        reject(error);
      })
    }))
    promises.push(new Promise((resolve, reject) => {
      api
      .post(`${ENDPOINT}/range/get`, {
          name: "AVAILABILITY"
      })
      .then((data) => {
        setAvailabilityPoints({
          ...availabilityPoints,
          start: data.range.start,
          end: data.range.end
        })
        resolve();
      })
      .catch((error) => {
        reject(error);
      })
    }))
    promises.push(new Promise((resolve, reject) => {
      api
      .post(`${ENDPOINT}/range/get`, {
          name: "PERFORMANCE"
      })
      .then((data) => {
        setPerformancePoints({
          ...performancePoints,
          start: data.range.start,
          end: data.range.end
        })
        resolve();
      })
      .catch((error) => {
        reject(error);
      })
    }))
    promises.push(new Promise((resolve, reject) => {
      api
      .post(`${ENDPOINT}/range/get`, {
          name: "QUALITY"
      })
      .then((data) => {
        setQualityPoints({
          ...qualityPoints,
          start: data.range.start,
          end: data.range.end
        })
        resolve();
      })
      .catch((error) => {
        reject(error);
      })
    }))
    promises.push(new Promise((resolve, reject) => {
      api
      .post(`${ENDPOINT}/range/get`, {
          name: "DER"
      })
      .then((data) => {
        setDERPoints({
          ...DERPoints,
          start: data.range.start,
          end: data.range.end
        })
        resolve();
      })
      .catch((error) => {
        reject(error);
      })
    }))
    promises.push(new Promise((resolve, reject) => {
      api
      .post(`${ENDPOINT}/range/get`, {
          name: "WIP"
      })
      .then((data) => {
        setWIPPoints({
          ...WIPPoints,
          start: data.range.start,
          end: data.range.end,
          startLimit: data.range.startLimit,
          endLimit: data.range.endLimit
        })
        resolve();
      })
      .catch((error) => {
        reject(error);
      })
    }))
    Promise
    .all(promises)
    .then(() => {
      setLoading(false);
    })
    .catch((error) => {
      if(error && error.data && error.data.message) {
        props.setError(error.data.message)
      } else {
        props.setError("An error occurred")
      }
    })
  }, []);
  const updateOEE = () => {
    setLoading(true);
    let api = new API();
    api
    .put(`${ENDPOINT}/range/update`, {
      name: "OEE",
      start: OEEPoints.start,
      end: OEEPoints.end
    })
    .then((data) => {
      setLoading(false);
    })
    .catch((error) => {
      if(error && error.data && error.data.message) {
        props.setError(error.data.message);
      }  else {
        props.setError("An error occurred")
      }
      setLoading(false);
    })
  }
  const updateAvailability = () => {
    setLoading(true);
    let api = new API();
    api
    .put(`${ENDPOINT}/range/update`, {
      name: "AVAILABILITY",
      start: availabilityPoints.start,
      end: availabilityPoints.end
    })
    .then((data) => {
      setLoading(false);
    })
    .catch((error) => {
      if(error && error.data && error.data.message) {
        props.setError(error.data.message);
      }  else {
        props.setError("An error occurred")
      }
      setLoading(false);
    })
  }
  const updatePerformance = () => {
    setLoading(true);
    let api = new API();
    api
    .put(`${ENDPOINT}/range/update`, {
      name: "PERFORMANCE",
      start: performancePoints.start,
      end: performancePoints.end
    })
    .then((data) => {
      setLoading(false);
    })
    .catch((error) => {
      if(error && error.data && error.data.message) {
        props.setError(error.data.message);
      }  else {
        props.setError("An error occurred")
      }
      setLoading(false);
    })
  }
  const updateQuality = () => {
    setLoading(true);
    let api = new API();
    api
    .put(`${ENDPOINT}/range/update`, {
      name: "QUALITY",
      start: qualityPoints.start,
      end: qualityPoints.end
    })
    .then((data) => {
      setLoading(false);
    })
    .catch((error) => {
      if(error && error.data && error.data.message) {
        props.setError(error.data.message);
      }  else {
        props.setError("An error occurred")
      }
      setLoading(false);
    })
  }
  const updateDER = () => {
    setLoading(true);
    let api = new API();
    api
    .put(`${ENDPOINT}/range/update`, {
      name: "DER",
      start: DERPoints.start,
      end: DERPoints.end
    })
    .then((data) => {
      setLoading(false);
    })
    .catch((error) => {
      if(error && error.data && error.data.message) {
        props.setError(error.data.message);
      }  else {
        props.setError("An error occurred")
      }
      setLoading(false);
    })
  }
  const updateWIP = () => {
    setLoading(true);
    if(!WIPPoints.end && !WIPPoints.endLimit) {
      setWIPPoints({
        ...WIPPoints,
        end: 0,
        endLimit: 0
      })
    }
    else if(!WIPPoints.end) {
      setWIPPoints({
        ...WIPPoints,
        end: 0
      })
    }
    else if(!WIPPoints.endLimit) {
      setWIPPoints({
        ...WIPPoints,
        endLimit: 0
      })
    }
    let api = new API();
    api
    .put(`${ENDPOINT}/range/update`, {
      name: "WIP",
      end: WIPPoints.end ? WIPPoints.end : 0,
      endLimit: WIPPoints.endLimit ? WIPPoints.endLimit: 0
    })
    .then((data) => {
      setLoading(false);
    })
    .catch((error) => {
      if(error && error.data && error.data.message) {
        props.setError(error.data.message);
      }  else {
        props.setError("An error occurred")
      }
      setLoading(false);
    })
  }
  if(loading) {
    return (
      <div style={{display: "flex", justifyContent: "center", height: "100%"}}>
        <div style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
          <CircularProgress size={200} />
        </div>  
      </div>
    )
  } else {
    return (
      <Grid container style={{width: "100%"}}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Grid container>
            <Grid item xs={4} sm={4} md={4} lg={4}>
              
            </Grid>
            <Grid item xs={4} sm={4} md={4} lg={4}>
              <h1 style={{marginTop: "20px", marginBottom: "0px"}}><b>Edit ranges</b></h1>
            </Grid>
            <Grid item xs={4} sm={4} md={4} lg={4}>
              
            </Grid>
          </Grid>
        </Grid>
        <Grid style={{width: "90%", display: "flex", justifyContent: "center", marginTop: "20px"}} item xs={12} sm={12} md={12} lg={12}>
          <Grid style={{display: "flex", alignItems: "center"}} container>
            <Grid style={{display: "flex", alignItems: "center"}} item xs={3} sm={3} md={3} lg={3}>
              <Grid style={{display: "flex", alignItems: "center"}} container>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <h2><b>OEE</b></h2>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Button onClick={updateOEE} style={{width: "50%"}} variant="contained" color="primary">Update</Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid style={{display: "flex", alignItems: "center"}} item xs={9} sm={9} md={9} lg={9}>
              <div style={{width: "90%"}}>
                <SliderInput 
                limits={[0, 100]}
                values={[OEEPoints.start, OEEPoints.end]}
                lock={[false, false]}
                formatFunc={(v) => { return Math.round(v * 10) / 10; }}
                labelFormatter={(value) => {return `${value}%`}}
                onChange={(values) => { setOEEPoints({ ...OEEPoints, start:values[0], end:values[1]}) }}
                reverse={false}  
                colors={["#ff0000", "#ff9900", "#00ff00"]}        
                />
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid style={{width: "90%", display: "flex", justifyContent: "center", marginTop: "20px"}} item xs={12} sm={12} md={12} lg={12}>
          <Grid style={{display: "flex", alignItems: "center"}} container>
            <Grid style={{display: "flex", alignItems: "center"}} item xs={3} sm={3} md={3} lg={3}>
              <Grid style={{display: "flex", alignItems: "center"}} container>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <h2><b>Availability</b></h2>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Button onClick={updateAvailability} style={{width: "50%"}} variant="contained" color="primary">Update</Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid style={{display: "flex", alignItems: "center"}} item xs={9} sm={9} md={9} lg={9}>
              <div style={{width: "90%"}}>
                <SliderInput 
                limits={[0, 100]}
                values={[availabilityPoints.start, availabilityPoints.end]}
                lock={[false, false]}
                formatFunc={(v) => { return Math.round(v * 10) / 10; }}
                labelFormatter={(value) => {return `${value}%`}}
                onChange={(values) => { setAvailabilityPoints({ ...availabilityPoints, start:values[0], end:values[1]}) }}
                reverse={false}  
                colors={["#ff0000", "#ff9900", "#00ff00"]}        
                />
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid style={{width: "90%", display: "flex", justifyContent: "center", marginTop: "20px"}} item xs={12} sm={12} md={12} lg={12}>
          <Grid style={{display: "flex", alignItems: "center"}} container>
            <Grid style={{display: "flex", alignItems: "center"}} item xs={3} sm={3} md={3} lg={3}>
              <Grid style={{display: "flex", alignItems: "center"}} container>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <h2><b>Performance</b></h2>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Button onClick={updatePerformance} style={{width: "50%"}} variant="contained" color="primary">Update</Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid style={{display: "flex", alignItems: "center"}} item xs={9} sm={9} md={9} lg={9}>
              <div style={{width: "90%"}}>
                <SliderInput 
                limits={[0, 100]}
                values={[performancePoints.start, performancePoints.end]}
                lock={[false, false]}
                formatFunc={(v) => { return Math.round(v * 10) / 10; }}
                labelFormatter={(value) => {return `${value}%`}}
                onChange={(values) => { setPerformancePoints({ ...performancePoints, start:values[0], end:values[1]}) }}
                reverse={false}  
                colors={["#ff0000", "#ff9900", "#00ff00"]}        
                />
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid style={{width: "90%", display: "flex", justifyContent: "center", marginTop: "20px"}} item xs={12} sm={12} md={12} lg={12}>
          <Grid style={{display: "flex", alignItems: "center"}} container>
            <Grid style={{display: "flex", alignItems: "center"}} item xs={3} sm={3} md={3} lg={3}>
              <Grid style={{display: "flex", alignItems: "center"}} container>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <h2><b>Quality</b></h2>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Button onClick={updateQuality} style={{width: "50%"}} variant="contained" color="primary">Update</Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid style={{display: "flex", alignItems: "center"}} item xs={9} sm={9} md={9} lg={9}>
              <div style={{width: "90%"}}>
                <SliderInput 
                limits={[0, 100]}
                values={[qualityPoints.start, qualityPoints.end]}
                lock={[false, false]}
                formatFunc={(v) => { return Math.round(v * 10) / 10; }}
                labelFormatter={(value) => {return `${value}%`}}
                onChange={(values) => { setQualityPoints({ ...qualityPoints, start:values[0], end:values[1]}) }}
                reverse={false}  
                colors={["#ff0000", "#ff9900", "#00ff00"]}        
                />
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid style={{width: "90%", display: "flex", justifyContent: "center", marginTop: "20px"}} item xs={12} sm={12} md={12} lg={12}>
          <Grid style={{display: "flex", alignItems: "center"}} container>
            <Grid style={{display: "flex", alignItems: "center"}} item xs={3} sm={3} md={3} lg={3}>
              <Grid style={{display: "flex", alignItems: "center"}} container>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <h2><b>DER</b></h2>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Button onClick={updateDER} style={{width: "50%"}} variant="contained" color="primary">Update</Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid style={{display: "flex", alignItems: "center"}} item xs={9} sm={9} md={9} lg={9}>
              <div style={{width: "90%"}}>
                <SliderInput 
                limits={[0, 100]}
                values={[DERPoints.start, DERPoints.end]}
                lock={[false, false]}
                formatFunc={(v) => { return Math.round(v * 10) / 10; }}
                labelFormatter={(value) => {return `${value}%`}}
                onChange={(values) => { setDERPoints({...DERPoints, start: values[0], end: values[1]}); }}
                reverse={false}  
                colors={["#ff0000", "#ff9900", "#00ff00"]}        
                />
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid style={{width: "90%", display: "flex", justifyContent: "center", marginTop: "20px"}} item xs={12} sm={12} md={12} lg={12}>
          <Grid style={{display: "flex", alignItems: "center"}} container>
            <Grid style={{display: "flex", alignItems: "center"}} item xs={3} sm={3} md={3} lg={3}>
              <Grid style={{display: "flex", alignItems: "center"}} container>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <h2><b>WIP</b></h2>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Button onClick={updateWIP} style={{width: "50%"}} variant="contained" color="primary">Update</Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid style={{display: "flex", alignItems: "center"}} item xs={9} sm={9} md={9} lg={9}>
              <div style={{width: "90%"}}>
                <SliderInput 
                limits={[WIPPoints.startLimit, WIPPoints.endLimit]}
                values={[WIPPoints.start, WIPPoints.end]}
                lock={[true, false]}
                formatFunc={(v) => { return Math.round(v * 10) / 10; }}
                labelFormatter={(value) => {return `${value}`}}
                endLabelFormatter={true}
                onEndLabelChange={(number) => {
                  if(number >= 0) {
                    if(WIPPoints.end > number) {
                      setWIPPoints({ ...WIPPoints, endLimit: number, end: number });
                    } else {
                      setWIPPoints({ ...WIPPoints, endLimit: number });
                    }
                  }
                }}
                onChange={(values) => { setWIPPoints({ ...WIPPoints, start:values[0], end:values[1]});}}
                reverse={false}  
                colors={["#ff0000", "#00ff00", "#ff9900"]}        
                />
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}