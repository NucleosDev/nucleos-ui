"use client";
import React from "react";
import Router from "next/router";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";

export function HeroScroll() {
  return (
    <div className="flex flex-col overflow-hidden pb-[500px] pt-[80px]">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl text-black dark:text-white">
              Entenda o Nucleos
              <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Nossa missão
              </span>
            </h1>
          </>
        }
      >
        <Image
          src="/placeholder.svg"
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
