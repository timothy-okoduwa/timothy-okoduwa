/** @format */

import React from "react";
import project from "./project";
import Image from "next/image";
import p from "./mypic.png";
const MainPage = () => {
  return (
    <div>
      <div className="cantsyat">
        <div className="mainn">
          <div className="djhdud">
            <div>
              <div className="nameofdev">Timothy Okoduwa</div>
              <div className="conff">
                <a href="mailto:timothyokoduwa4@gmail.com" className="email">
                  timothyokoduwa4@gmail.com
                </a>
              </div>
            </div>

            <div className="forimage">
              <Image src={p} alt="timothys image" width={500} height={500} />
            </div>
          </div>

          <div className="infoss">
            Hello and welcome to my digital space! I’m Timothy Okoduwa, a
            passionate problem solver who thrives on creating impactful software
            solutions. <br /> <br />
            I’m always on the hunt for knowledge, whether it’s through
            tutorials, documentation, articles, or any resource that feeds my
            curiosity. <br /> My ultimate aim is to refine my skills and reach
            the pinnacle of engineering excellence. <br /> <br /> At the moment,
            I’m building something exciting — a software called{" "}
            <a href="https://snippad.cloud/" className="email">
             Snippad
            </a>
            . <br />
            <br /> While I primarily work in the TypeScript/JavaScript
            ecosystem, <br /> I’m also diving into other fascinating languages
            like Dart, Python, and Solidity.
          </div>
          <div className="projj">
            <div className="lettl">Projects</div>
            <div>
              {project.map((proj, index) => (
                <div key={index}>
                  <div className="secondp">
                    <div className="firstc">{proj.name}</div>
                    <div className="secondc">({proj.type})</div>
                  </div>
                  <div className="expp">{proj.description}</div>
                  <div className="mt-3">
                    <div className="borr">
                      <a
                        href={proj.link} target='_blank'
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <span>Webisite</span>{" "}
                        <span className="mx-1">
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12.9999 11.75C12.8099 11.75 12.6199 11.68 12.4699 11.53C12.1799 11.24 12.1799 10.76 12.4699 10.47L20.6699 2.27001C20.9599 1.98001 21.4399 1.98001 21.7299 2.27001C22.0199 2.56001 22.0199 3.04001 21.7299 3.33001L13.5299 11.53C13.3799 11.68 13.1899 11.75 12.9999 11.75Z"
                              fill="#b6aeaa"
                            />
                            <path
                              d="M22 7.55C21.59 7.55 21.25 7.21 21.25 6.8V2.75H17.2C16.79 2.75 16.45 2.41 16.45 2C16.45 1.59 16.79 1.25 17.2 1.25H22C22.41 1.25 22.75 1.59 22.75 2V6.8C22.75 7.21 22.41 7.55 22 7.55Z"
                              fill="#b6aeaa"
                            />
                            <path
                              d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H11C11.41 1.25 11.75 1.59 11.75 2C11.75 2.41 11.41 2.75 11 2.75H9C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V13C21.25 12.59 21.59 12.25 22 12.25C22.41 12.25 22.75 12.59 22.75 13V15C22.75 20.43 20.43 22.75 15 22.75Z"
                              fill="#b6aeaa"
                            />
                          </svg>
                        </span>
                      </a>
                    </div>
                    {proj.github !== "" && (
                      <div className="borr">
                        <a
                          href={proj.github}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <span>GitHub</span>{" "}
                          <span className="mx-1">
                            <svg
                              width="10px"
                              height="10px"
                              viewBox="0 0 20 20"
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="#b6aeaa"
                            >
                              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                              <g
                                id="SVGRepo_tracerCarrier"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></g>
                              <g id="SVGRepo_iconCarrier">
                                <title>github [#142]</title>
                                <desc>Created with Sketch.</desc>
                                <g
                                  id="Page-1"
                                  stroke="none"
                                  strokeWidth="1"
                                  fill="none"
                                  fillRule="evenodd"
                                >
                                  <g
                                    id="Dribbble-Light-Preview"
                                    transform="translate(-140.000000, -7559.000000)"
                                    fill="#b6aeaa"
                                  >
                                    <g
                                      id="icons"
                                      transform="translate(56.000000, 160.000000)"
                                    >
                                      <path
                                        d="M94,7399 C99.523,7399 104,7403.59 104,7409.253 C104,7413.782 101.138,7417.624 97.167,7418.981 C96.66,7419.082 96.48,7418.762 96.48,7418.489 C96.48,7418.151 96.492,7417.047 96.492,7415.675 C96.492,7414.719 96.172,7414.095 95.813,7413.777 C98.04,7413.523 100.38,7412.656 100.38,7408.718 C100.38,7407.598 99.992,7406.684 99.35,7405.966 C99.454,7405.707 99.797,7404.664 99.252,7403.252 C99.252,7403.252 98.414,7402.977 96.505,7404.303 C95.706,7404.076 94.85,7403.962 94,7403.958 C93.15,7403.962 92.295,7404.076 91.497,7404.303 C89.586,7402.977 88.746,7403.252 88.746,7403.252 C88.203,7404.664 88.546,7405.707 88.649,7405.966 C88.01,7406.684 87.619,7407.598 87.619,7408.718 C87.619,7412.646 89.954,7413.526 92.175,7413.785 C91.889,7414.041 91.63,7414.493 91.54,7415.156 C90.97,7415.418 89.522,7415.871 88.63,7414.304 C88.63,7414.304 88.101,7413.319 87.097,7413.247 C87.097,7413.247 86.122,7413.234 87.029,7413.87 C87.029,7413.87 87.684,7414.185 88.139,7415.37 C88.139,7415.37 88.726,7417.2 91.508,7416.58 C91.513,7417.437 91.522,7418.245 91.522,7418.489 C91.522,7418.76 91.338,7419.077 90.839,7418.982 C86.865,7417.627 84,7413.783 84,7409.253 C84,7403.59 88.478,7399 94,7399"
                                        id="github-[#142]"
                                      ></path>
                                    </g>
                                  </g>
                                </g>
                              </g>
                            </svg>
                          </span>
                        </a>
                      </div>
                    )}
                    {proj.npm !== "" && (
                      <div className="borr">
                        <a
                          href={proj.npm}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <span>NPM</span>{" "}
                          <span className="mx-1">
                            <svg
                              width="10px"
                              height="10px"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="#B6AEAA"
                            >
                              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                              <g
                                id="SVGRepo_tracerCarrier"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              ></g>
                              <g id="SVGRepo_iconCarrier">
                                {" "}
                                <g>
                                  {" "}
                                  <path
                                    fill="none"
                                    d="M0 0H24V24H0z"
                                  ></path>{" "}
                                  <path d="M20 3c.552 0 1 .448 1 1v16c0 .552-.448 1-1 1H4c-.552 0-1-.448-1-1V4c0-.552.448-1 1-1h16zm-1 2H5v14h14V5zm-2 2v10h-2.5V9.5H12V17H7V7h10z"></path>{" "}
                                </g>{" "}
                              </g>
                            </svg>
                          </span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="kfie">
              <div className="lettl ">More</div>
              <div className="mt-3">
                <a href="https://github.com/timothy-okoduwa" className="eifj">
                  <div className="bugsss">
                    <div>
                      <svg
                        width="14px"
                        height="14px"
                        viewBox="0 0 20 20"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#b6aeaa"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          <title>github [#142]</title>
                          <desc>Created with Sketch.</desc>
                          <g
                            id="Page-1"
                            stroke="none"
                            strokeWidth="1"
                            fill="none"
                            fillRule="evenodd"
                          >
                            <g
                              id="Dribbble-Light-Preview"
                              transform="translate(-140.000000, -7559.000000)"
                              fill="#b6aeaa"
                            >
                              <g
                                id="icons"
                                transform="translate(56.000000, 160.000000)"
                              >
                                <path
                                  d="M94,7399 C99.523,7399 104,7403.59 104,7409.253 C104,7413.782 101.138,7417.624 97.167,7418.981 C96.66,7419.082 96.48,7418.762 96.48,7418.489 C96.48,7418.151 96.492,7417.047 96.492,7415.675 C96.492,7414.719 96.172,7414.095 95.813,7413.777 C98.04,7413.523 100.38,7412.656 100.38,7408.718 C100.38,7407.598 99.992,7406.684 99.35,7405.966 C99.454,7405.707 99.797,7404.664 99.252,7403.252 C99.252,7403.252 98.414,7402.977 96.505,7404.303 C95.706,7404.076 94.85,7403.962 94,7403.958 C93.15,7403.962 92.295,7404.076 91.497,7404.303 C89.586,7402.977 88.746,7403.252 88.746,7403.252 C88.203,7404.664 88.546,7405.707 88.649,7405.966 C88.01,7406.684 87.619,7407.598 87.619,7408.718 C87.619,7412.646 89.954,7413.526 92.175,7413.785 C91.889,7414.041 91.63,7414.493 91.54,7415.156 C90.97,7415.418 89.522,7415.871 88.63,7414.304 C88.63,7414.304 88.101,7413.319 87.097,7413.247 C87.097,7413.247 86.122,7413.234 87.029,7413.87 C87.029,7413.87 87.684,7414.185 88.139,7415.37 C88.139,7415.37 88.726,7417.2 91.508,7416.58 C91.513,7417.437 91.522,7418.245 91.522,7418.489 C91.522,7418.76 91.338,7419.077 90.839,7418.982 C86.865,7417.627 84,7413.783 84,7409.253 C84,7403.59 88.478,7399 94,7399"
                                  id="github-[#142]"
                                ></path>
                              </g>
                            </g>
                          </g>
                        </g>
                      </svg>
                    </div>
                    <div>Bugs</div>
                  </div>
                </a>
              </div>
              <div className="mt-3">
                <a href="https://x.com/TimothyOkoduwa" className="eifj">
                  <div className="bugsss">
                    <div>
                      <svg
                        fill="#b6aeaa"
                        version="1.1"
                        width="14px"
                        height="14px"
                        viewBox="0 0 512 512"
                        xmlSpace="preserve"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          <g id="7935ec95c421cee6d86eb22ecd12f847">
                            <path
                              style={{ display: "inline" }}
                              d="M459.186,151.787c0.203,4.501,0.305,9.023,0.305,13.565 c0,138.542-105.461,298.285-298.274,298.285c-59.209,0-114.322-17.357-160.716-47.104c8.212,0.973,16.546,1.47,25.012,1.47 c49.121,0,94.318-16.759,130.209-44.884c-45.887-0.841-84.596-31.154-97.938-72.804c6.408,1.227,12.968,1.886,19.73,1.886 c9.55,0,18.816-1.287,27.617-3.68c-47.955-9.633-84.1-52.001-84.1-102.795c0-0.446,0-0.882,0.011-1.318 c14.133,7.847,30.294,12.562,47.488,13.109c-28.134-18.796-46.637-50.885-46.637-87.262c0-19.212,5.16-37.218,14.193-52.7 c51.707,63.426,128.941,105.156,216.072,109.536c-1.784-7.675-2.718-15.674-2.718-23.896c0-57.891,46.941-104.832,104.832-104.832 c30.173,0,57.404,12.734,76.525,33.102c23.887-4.694,46.313-13.423,66.569-25.438c-7.827,24.485-24.434,45.025-46.089,58.002 c21.209-2.535,41.426-8.171,60.222-16.505C497.448,118.542,479.666,137.004,459.186,151.787z"
                            ></path>
                          </g>
                        </g>
                      </svg>
                    </div>
                    <div>Rants and Random</div>
                  </div>
                </a>
              </div>
              <div className="ouuu">
                <div className="lineee"></div>
                <div className="mt-3">
                  <div className="rights">
                    © MMXXV Timothy Okoduwa. | All Rights Reserved.
                  </div>
                </div>
                <div className="rights">
                  Source Code:{" "}
                  <a
                    href="https://github.com/timothy-okoduwa/timothy-okoduwa"
                    className="email"
                  >
                    github.com/timothy-okoduwa/timothy-okoduwa
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
