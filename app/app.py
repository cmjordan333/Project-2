import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

#################################################
# Database Setup
#################################################

# app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/NAMEOFOURFILE.sqlite"
# db = SQLAlchemy(app)

# # reflect an existing database into a new model
# Base = automap_base()
# # reflect the tables
# Base.prepare(db.engine, reflect=True)

# # Save references to each table
# Samples_rapworldmap = Base.classes.sample_rapdata
# Samples = Base.classes.samples

# HOME PAGE
@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/Home")
def Home():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/lyrics")
def lyrics():
    """Return the lyrics page."""
    return render_template("lyrics.html")

@app.route("/rip")
def rip():
    """Return the rip page."""
    return render_template("sec-comp.html")

@app.route("/worldmap")
def worldmap():
    """Return the Worldmap page."""
    return render_template("Worldmap.html")

@app.route("/wordcloud")
def wordcloud():
    """Return the rip page."""
    return render_template("fourth-comp.html")


######## API ROUTES

# rapRIP csv data into JSON
@app.route("/api/rapRIP")
def rapRIP():
    # Read the CSV
    rip_df = pd.read_csv('db/dataset/rapRIP.csv')

    ### NEW LINE ###
    rap_rip_df = rip_df[['name', 'location__city', 'birth_year', 'death_year', 'career_start', 'bio__summary']].dropna()
    # Convert it to JSON
    data = rap_rip_df.to_dict(orient="records")
    # Send the JSON data
    return jsonify(data)

# random facts json
@app.route("/api/randomfacts")
def randomfacts():
    # Read the CSV
    random_df = pd.read_json('db/dataset/random-facts.json')
    # Convert it to JSON
    data = random_df.to_dict(orient="records")
    # Send the JSON data
    return jsonify(data)

# worldmap facts
@app.route("/api/worldmap-data")
def worldmap_data():
    # Read the CSV
    worldmap_data_df = pd.read_csv('db/dataset/rapworldmap-artists.csv')
    worldmap_data_df_clean = worldmap_data_df[['name', 'LONG', 'LAT ', 'youtube__clipExampleUrl']].dropna()
    # Convert it to JSON
    data = worldmap_data_df_clean.to_dict(orient="records")
    # Send the JSON data
    return jsonify(data)

# @app.route("/names")
# def names():
#     """Return a list of sample names."""

#     # Use Pandas to perform the sql query
#     stmt = db.session.query(Samples).statement
#     df = pd.read_sql_query(stmt, db.session.bind)

#     # Return a list of the column names (sample names)
#     return jsonify(list(df.columns)[2:])


# @app.route("/metadata/<sample>")
# def sample_rapdata(sample):
#     """Return the MetaData for a given sample."""
#     sel = [
#         Samples_rapworldmap.sample,
#         Samples_rapworldmap.ETHNICITY,
#         Samples_rapworldmap.GENDER,
#         Samples_rapworldmap.AGE,
#         Samples_rapworldmap.LOCATION,
#         Samples_rapworldmap.BBTYPE,
#         Samples_rapworldmap.WFREQ,
#     ]

#     results = db.session.query(*sel).filter(Samples_rapworldmap.sample == sample).all()

#     # Create a dictionary entry for each row of metadata information
#     sample_rapdata = {}
#     for result in results:
#         sample_rapdata["sample"] = result[0]
#         sample_rapdata["ETHNICITY"] = result[1]
#         sample_rapdata["GENDER"] = result[2]
#         sample_rapdata["AGE"] = result[3]
#         sample_rapdata["LOCATION"] = result[4]
#         sample_rapdata["BBTYPE"] = result[5]
#         sample_rapdata["WFREQ"] = result[6]

#     print(sample_rapdata)
#     return jsonify(sample_rapdata)


# @app.route("/samples/<sample>")
# def samples(sample):
#     """Return `otu_ids`, `otu_labels`,and `sample_values`."""
#     stmt = db.session.query(Samples).statement
#     df = pd.read_sql_query(stmt, db.session.bind)

#     # Filter the data based on the sample number and
#     # only keep rows with values above 1
#     sample_data = df.loc[df[sample] > 1, ["otu_id", "otu_label", sample]]

#     # Sort by sample
#     sample_data.sort_values(by=sample, ascending=False, inplace=True)

#     # Format the data to send as json
#     data = {
#         "otu_ids": sample_data.otu_id.values.tolist(),
#         "sample_values": sample_data[sample].values.tolist(),
#         "otu_labels": sample_data.otu_label.tolist(),
#     }
#     return jsonify(data)


if __name__ == "__main__":
    app.run()
