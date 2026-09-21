import React from 'react';
import ServiceCard from './ServiceCard';
import './Services.scss';

export default function ServiceGrid({ services = [] }) {
  return (
    <div className={`service-editorial-mosaic ${services.length === 3 ? 'showing-three' : ''}`}>
      {services.map((service, index) => (
        <ServiceCard key={service.id || service.slug} service={service} index={index} />
      ))}
    </div>
  );
}
