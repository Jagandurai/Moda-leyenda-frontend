import { assets } from "../assets/assets"

const OurPolicy = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6 text-center">

        {/* Policy Item */}
        <div className="flex flex-col items-center">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <img 
              src={assets.exchange_icon} 
              className="w-10 sm:w-12" 
              alt="Exchange Policy"
            />
          </div>
          <p className="text-base sm:text-lg font-semibold text-gray-800">
            Easy Exchange Policy
          </p>
          <p className="mt-2 text-sm sm:text-base text-gray-500 max-w-xs">
            We offer hassle-free exchange on all eligible products.
          </p>
        </div>

        {/* Policy Item */}
        <div className="flex flex-col items-center">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <img 
              src={assets.quality_icon} 
              className="w-10 sm:w-12" 
              alt="Return Policy"
            />
          </div>
          <p className="text-base sm:text-lg font-semibold text-gray-800">
            7 Days Return Policy
          </p>
          <p className="mt-2 text-sm sm:text-base text-gray-500 max-w-xs">
            Enjoy a 7-day free return policy with no hidden charges.
          </p>
        </div>

        {/* Policy Item */}
        <div className="flex flex-col items-center">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <img 
              src={assets.support_img} 
              className="w-10 sm:w-12" 
              alt="Customer Support"
            />
          </div>
          <p className="text-base sm:text-lg font-semibold text-gray-800">
            Best Customer Support
          </p>
          <p className="mt-2 text-sm sm:text-base text-gray-500 max-w-xs">
            Our team is available 24/7 to assist you anytime.
          </p>
        </div>

      </div>
    </section>
  )
}

export default OurPolicy