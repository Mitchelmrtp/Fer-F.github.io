import React from 'react';

const ProductLayout = ({ title, showViewAll = false, onViewAll, children, sidebar }) => {
  return (
    <section className="bg-[#f6f9fc] min-h-screen py-8">
      <div className="mx-auto px-0 md:px-4 max-w-8xl">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/4 w-full">
            {sidebar}
          </div>
          <div className="w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>
              {showViewAll && (
                <div 
                  onClick={onViewAll} 
                  className="flex items-center cursor-pointer hover:text-blue-600 transition-colors"
                >
                  <span className="mr-2 text-sm md:text-base">Ver Todo</span>
                  <i className="fa fa-caret-right"></i>
                </div>
              )}
            </div>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductLayout;