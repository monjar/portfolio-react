import React, { SyntheticEvent } from "react";
import Project from "../data/models/Project";
import "./Gallery.css";
import IrregularGrid from "./utils/IrregularGrid";

import { galleryData } from "../data/repository";

const GalleryItem = (props: any) => {
    const data: Project = props.data;
    return (
        <a className="gallery-item">

            <div className="gallery-item-title">{data.title}</div>

            <div className="gallery-item-desc">{data.desc}</div>
            <div className="gallery-item-date">{data.date}</div>



            <iframe className="video-responsive"

                src={data.video}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"

                allowFullScreen
                title="Embedded youtube"
            />

            <div className="gallery-item-stack">
                {data.stackIcons?.map((icon) => (
                    <div className="gallery-item-stackitem">{icon}</div>
                ))}
            </div>

            <div className="gallery-item-divider"></div>


        </a>
    );
};

const Gallery = (props: any) => {
    return (
        <>
            <div className="gallery-section-title">Gallery</div>
            <div>
                {galleryData.map((data: Project) => (
                    <GalleryItem data={data} />
                ))}
            </div>
        </>
    );
};

export default Gallery;
