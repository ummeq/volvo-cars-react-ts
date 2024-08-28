import React, { useState, useEffect, useRef  } from 'react';
import './VolvoCarList.css';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface VolvoModel {
  id: string;
  modelName: string;
  bodyType: string;
  modelType: string;
  imageUrl: string;
}


function VolvoCarList(): JSX.Element {
  let sliderRef = useRef<Slider | null>(null);
  const [volvoModels, setVolvoModels] = useState<Array<VolvoModel>>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const next = () => {
    (sliderRef.current as Slider)?.slickNext();
  };
  const previous = () => {
    (sliderRef.current as Slider)?.slickPrev();
  };

  const settings = {
    dots: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    infinite: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
          dots: true
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
        }
      }
    ],
    };
 useEffect(() => {
       fetchVolvoModels();
  }, []);

  const fetchVolvoModels = async (bodyType = '') => {
    try {
      const response = await fetch(`http://localhost:3000/api/volvoModels${bodyType ? `?bodyType=${bodyType}` : ''}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: VolvoModel[] = await response.json();
      setVolvoModels(data);
    } catch (error) {
      console.error('Error fetching Volvo models:', error);
    }
  }

  const handleInputChange = (event: { target: { value: any; }; }) => {
    const { value } = event.target;
    setSearchTerm(value);
    fetchVolvoModels(value); // Fetch filtered data based on input
  };

  return (
    <div className="container">
        <input
            type="text"
            placeholder="Filter by body type"
            value={searchTerm}
            onChange={handleInputChange}
        />
      <Slider ref={sliderRef} {...settings}>
        {volvoModels.map((car, index) => (
            <div key={index}>
              <div className='car-headers'>
                <div>{car.bodyType}</div>
                <span className='car-model'>{car.modelName}</span>
                <span>{car.modelType}</span>
              </div>
              <div className="img-body">
                <img src={car.imageUrl} alt={car.modelName} className='cars-image' />
              </div>
              <div className='sub-heading'>
                <span className="learn">LEARN <span className="arrow">&gt;</span></span>
                <span className="shop">SHOP <span className="arrow">&gt;</span></span>
              </div>
            </div>
            
        ))}
      </Slider>
      <div className="button-container">
          <div className="prev-arrow button" onClick={previous}>
            <svg xmlns="http://www.w3.org/2000/svg" stroke="black" height="24" viewBox="0 -960 960 960" width="24"><path d="m242-200 200-280-200-280h98l200 280-200 280h-98Zm238 0 200-280-200-280h98l200 280-200 280h-98Z"/></svg>
          </div>
        <div className="next-arrow button"  onClick={next}>
            <svg xmlns="http://www.w3.org/2000/svg" stroke="black" height="24" viewBox="0 -960 960 960" width="24"><path d="m242-200 200-280-200-280h98l200 280-200 280h-98Zm238 0 200-280-200-280h98l200 280-200 280h-98Z"/></svg>
        </div>
      </div>
    </div>
  );
}

export default VolvoCarList;
