import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { StyledCard } from "../../components/cards";
import { Box, Grid } from "@mui/material";
import { useRecoilState } from "recoil";
import {
  nftsAtom,
  nftsSelectionAtom,
  pairingsAtom,
  questsAtom,
  questsSelectionAtom,
} from "./state/atoms";
import {
  GridContextProvider,
  GridDropZone,
  GridItem,
  swap,
  move,
} from "react-grid-dnd";
import { forwardRef, useCallback, useEffect, useState } from "react";

import MuiImageSlider from "mui-image-slider";
import axios from "axios";

import { defaultAnnouncements, DndContext, useDndMonitor } from "@dnd-kit/core";
import {
  useDroppable,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* eslint-disable-next-line */
const DraggableItem = forwardRef((props: { [key: string]: unknown }, ref) => {
  return (
    //@ts-ignore
    <div {...props} ref={ref}>
      {props.children}
    </div>
  );
});
export function UseDroppable(props) {
  const { setNodeRef } = useDroppable({
    id: props.id,
  });
  let style: { [key: string]: unknown } = {};

  style = {
    ...style,
    ...(props.styles || {}),
    background: "rgba(0, 0, 0, 0)",
    minHeight: "50%",
    height: props.items.length === 0 ? "200px" : "max-content",
  };

  return (
    <SortableContext id={props.id} items={props.items}>
      <div ref={setNodeRef} style={style}>
        {props.items.map((item) => (
          <Draggable key={item.id} id={item.id} item={item} />
        ))}
      </div>
    </SortableContext>
  );
}

export function Draggable(props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: props.id,
    });
  let style: { [key: string]: unknown } = transform
    ? {
        transform: CSS.Transform.toString(transform),
      }
    : {};

  style = {
    ...style,
    background: "rgba(0, 0, 0, 0)",
    border: "unset",
  };

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <DraggableItem>
        <div
          style={{
            width: "85px",
            height: "85px",
            background: `url("${props.item.offchainMetadata.image}")`,
            backgroundSize: "cover",
            boxSizing: "border-box",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "50%",
          }}
        >
          {props.children}
        </div>
      </DraggableItem>
    </button>
  );
}

// @ts-ignore
export const NFTGalleryItems = ({ onSelection }) => {
  const [activeId, setActiveId] = useState(null);
  const [active, setActive] = useState(null);

  const [nfts] = useRecoilState(nftsAtom);
  const [nftsSelection, setNftsSelection] = useRecoilState(nftsSelectionAtom);
  const [quests, setQuests] = useRecoilState(questsAtom);
  const [questSelection] = useRecoilState(questsSelectionAtom);

  const [items, setItems] = useRecoilState(pairingsAtom);

  useEffect(() => {
    //@ts-ignore
    setNftsSelection([items.genOneStaking, items.genTwoStaking]);
  }, [items]);

  useEffect(() => {
    async function fetchNFTMetadata() {
      const nftsWithMetadata = await Promise.all(
        nfts.map(async (nft, index) => {
          let id = String("NFT-" + index);
          let offchainMetadata = { image: "", properties: { creators: [] } };
          try {
            offchainMetadata = (await axios.get(nft.uri)).data;
            console.log(
              nft.name,
              nft.uri,
              offchainMetadata.properties.creators[0].address,
              offchainMetadata
            );
          } catch (e) {
            offchainMetadata.properties.creators.push({ address: "" });
            console.log("fail");
          }
          return { ...nft, offchainMetadata, id };
        })
      );

      console.log("DONE WITH FETCHING");

      setItems({
        ...items,
        genOneDraggable: nftsWithMetadata
          .filter((item) => {
            return (
              Object.values(items.genOneStaking).findIndex(
                (stakedItem) => stakedItem.id === item.id
              ) === -1
            );
          })
          .filter((item) => {
            return (
              item.offchainMetadata.properties.creators[0].address ===
              "2zJ3v9EHP5eStxMF7qkPS8KX4uUU9JTqk74F987XmkAo"
            );
          }),
        genTwoDraggable: nftsWithMetadata
          .filter((item) => {
            return (
              Object.values(items.genTwoStaking).findIndex(
                (stakedItem) => stakedItem.id === item.id
              ) === -1
            );
          })
          .filter((item) => {
            return (
              item.offchainMetadata.properties.creators[0].address ===
              "Gzr2ebsdPQJ15yWwpC4fFan7AmmFDvzQfkQ3qSGmknZ3"
            );
          }),
      });
    }

    fetchNFTMetadata();
  }, [nfts]);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  //@ts-ignore
  const UseImages = useCallback(
    (container) => {
      if (!items.hasOwnProperty(container) || items[container].length === 0) {
        return [
          "https://upload.wikimedia.org/wikipedia/commons/4/48/BLANK_ICON.png",
          "https://upload.wikimedia.org/wikipedia/commons/4/48/BLANK_ICON.png",
        ];
      }
      return [
        ...items[container].map((item) => item.offchainMetadata.image),
        "https://upload.wikimedia.org/wikipedia/commons/4/48/BLANK_ICON.png",
      ];
    },
    [items]
  );

  useEffect(() => {
    console.log(quests[questSelection]);
  }, [quests]);

  return (
    <>
      <DndContext
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragCancel={handleDragCancel}
        sensors={sensors}
        accessibility={{ announcements: defaultAnnouncements }}
      >
        <Box>
          <StyledCard
            className="xquesting-enrollment-box"
            style={{ width: "60vw" }}
          >
            <Grid container alignItems="center" justifyContent="center">
              <Grid item sx={{ justifyContent: "center" }} xs={12}>
                <Typography
                  style={{ fontSize: "2.5rem" }}
                  gutterBottom
                  variant="h5"
                  component="div"
                >
                  Overview
                </Typography>
              </Grid>
              <Grid container item sx={{ justifyContent: "center" }} xs={5}>
                <div style={{ height: "200px !important" }}>
                  <MuiImageSlider
                    arrows={true}
                    alwaysShowArrows={true}
                    fitToImageHeight={true}
                    images={UseImages("genOneStaking")}
                  />
                </div>
              </Grid>
              <Grid
                container
                item
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                xs={2}
              >
                <Typography
                  style={{ paddingBottom: "40%", fontSize: "1.9rem" }}
                  gutterBottom
                  variant="h5"
                  component="div"
                >
                  Scroll to view!
                </Typography>
                <Typography
                  style={{ fontSize: "1.9rem" }}
                  gutterBottom
                  variant="h5"
                  component="div"
                >
                  Drag to Stake!
                </Typography>
              </Grid>
              <Grid container item sx={{ justifyContent: "center" }} xs={5}>
                <div style={{ height: "200px !important" }}>
                  <MuiImageSlider
                    arrows={true}
                    alwaysShowArrows={true}
                    fitToImageHeight={true}
                    images={UseImages("genTwoStaking")}
                  />
                </div>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <Typography
                  style={{ fontSize: "1.1rem" }}
                  gutterBottom
                  variant="h5"
                  component="div"
                >
                  Gen One's Staking ({quests[questSelection].PairsConfig.Left}{" "}
                  Required)
                </Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid container item>
                <Grid
                  item
                  alignItems="center"
                  justifyContent="center"
                  xs={12}
                  sx={{}}
                >
                  <StyledCard
                    className="xquesting-enrollment-box"
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gridTemplateRows: "1fr",
                    }}
                  >
                    <UseDroppable
                      styles={{
                        zIndex: 2,
                        gridRowStart: 1,
                        gridColumnStart: 1,
                      }}
                      id={"genOneStaking"}
                      items={items.genOneStaking}
                    />
                    <Box
                      sx={{
                        zIndex: 1,
                        gridRowStart: 1,
                        gridColumnStart: 1,
                        padding: "10%",
                        height: "max-content",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        style={{
                          fontSize: "1.9rem",
                          opacity:
                            items.genOneStaking.length === 0 ? "1.0" : "0.1",
                        }}
                        variant="h5"
                        component="div"
                      >
                        Drag to Stake!
                      </Typography>
                    </Box>
                  </StyledCard>
                </Grid>
              </Grid>
              <Grid item xs={6} sx={{}}>
                <StyledCard className="xquesting-enrollment-box">
                  <Typography
                    style={{ fontSize: "0.9rem" }}
                    gutterBottom
                    variant="h5"
                    component="div"
                  >
                    Available Gen One's
                  </Typography>
                  <Box sx={{ height: "max-content", minHeight: "200px" }}>
                    <UseDroppable
                      id={"genOneDraggable"}
                      items={items.genOneDraggable}
                    />
                  </Box>
                </StyledCard>
              </Grid>
            </Grid>
          </StyledCard>
          <DragOverlay>
            {activeId ? (
              <Draggable id={activeId} key={activeId} item={active} />
            ) : null}
          </DragOverlay>
        </Box>
      </DndContext>
    </>
  );

  function findContainer(id) {
    if (id in items) {
      return id;
    }

    return Object.keys(items).find(
      (key) => items[key].findIndex((item) => item.id === id) !== -1
    );
  }

  function handleDragStart(event) {
    console.log("grabbing");
    const activeId = event.active.id;
    const activeContainer = findContainer(activeId);
    const activeItem = items[activeContainer].findIndex(
      (item) => item.id === activeId
    );

    setActiveId(activeId);
    setActive(items[activeContainer][activeItem]);
  }

  function handleDragOver(event) {
    const { active, over, draggingRect } = event;
    const { id } = active;
    if (over === null) return;
    const { id: overId } = over;

    // Find the containers
    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);
    console.log(activeContainer, overContainer);

    if (
      (activeContainer === "genOneDraggable" ||
        activeContainer === "genOneStaking") ===
      (overContainer === "genTwoDraggable" || overContainer === "genTwoStaking")
    ) {
      return;
    }

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setItems((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];
      console.log(activeItems, overItems);

      // Find the indexes for the items
      const activeIndex = activeItems.findIndex((item) => item.id === id);
      if (activeIndex === -1) return prev;
      console.log(Number(activeIndex), overId);
      const overIndex = overItems.length;

      let newIndex;
      if (overId in prev) {
        // We're at the root droppable of a container
        newIndex = overItems.length + 1;
      } else {
        const isBelowLastItem =
          over &&
          overIndex === overItems.length - 1 &&
          draggingRect.offsetTop > over.rect.offsetTop + over.rect.height;

        const modifier = isBelowLastItem ? 1 : 0;

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      let newData = {
        ...prev,
        [activeContainer]: [
          ...prev[activeContainer].filter(
            (item, index) => index !== activeIndex
          ),
        ],
        [overContainer]: [
          ...prev[overContainer],
          prev[activeContainer][activeIndex],
        ],
      };

      return newData;
    });

    setActiveId(null);
    setActive(null);
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    console.log(active, over);
    if (over === null) return null;
    const { id } = active;
    const { id: overId } = over;

    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }

    const activeIndex = items[activeContainer].indexOf(active.id);
    const overIndex = items[overContainer].indexOf(overId);

    if (activeIndex !== overIndex) {
      setItems((items) => ({
        ...items,
        [overContainer]: arrayMove(
          items[overContainer],
          activeIndex,
          overIndex
        ),
      }));
    }

    setActiveId(null);
  }

  function handleDragCancel() {
    setActiveId(null);
  }
};

//@ts-ignore
export const QuestStart = ({ onSelection }) => {
  const [nfts] = useRecoilState(nftsAtom);
  const [nftsSelection, setNftsSelection] = useRecoilState(nftsSelectionAtom);
  const [questSelection] = useRecoilState(questsSelectionAtom);

  return (
    <>
      <StyledCard
        className="xquesting-enrollment-box"
        style={{ width: "60vw" }}
      >
        <CardContent style={{ paddingTop: "5%", paddingBottom: "5%" }}>
          <CardActions
            style={{
              display: "block",
              textAlign: "center",
              alignItems: "center",
              margin: "auto",
            }}
          >
            <Button
              sx={{ fontSize: "1.5rem", color: "#fff" }}
              className="xquesting-enrollment-box"
              onClick={(event) => onSelection(event, questSelection)}
              size="small"
            >
              Start
            </Button>
          </CardActions>
        </CardContent>
        <Grid container>
          <Grid item xs={nftsSelection[1].length > 0 ? 6 : 12}>
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <StyledCard
                className="xquesting-enrollment-box"
                sx={{ width: "80%" }}
              >
                <Grid container>
                  <Grid item xs={12}>
                    <Typography
                      align="left"
                      style={{
                        paddingLeft: "0%",
                        color: "#fff",
                        fontSize: "1.3rem",
                      }}
                      variant="h5"
                      component="div"
                    >
                      Gen One's Staking!
                    </Typography>
                  </Grid>
                  {nftsSelection[0].map((nft, nftIndex) => (
                    <Grid item key={nftIndex}>
                      <Box textAlign="center">
                        <StyledCard>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <CardMedia
                              component="img"
                              height="140"
                              image={
                                // @ts-ignore
                                nft.offchainMetadata.hasOwnProperty("image")
                                  ? // @ts-ignore
                                    nft.offchainMetadata.image
                                  : "https://www.arweave.net/GLeORZQuLxFzDFK0aBQKwhQUUF0-4eawXnrjdtmv5fg?ext=png"
                              }
                            />
                          </div>
                          <CardContent>
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="div"
                            >
                              {
                                // @ts-ignore
                                nft.name
                              }
                            </Typography>
                          </CardContent>
                        </StyledCard>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </StyledCard>
            </Box>
          </Grid>
          {nftsSelection[1].length > 0 && (
            <Grid item xs={6}>
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <StyledCard
                  className="xquesting-enrollment-box"
                  style={{ width: "80%" }}
                >
                  <Grid container>
                    <Grid item xs={12}>
                      <Typography
                        align="left"
                        style={{
                          paddingLeft: "0%",
                          color: "#fff",
                          fontSize: "1.3rem",
                        }}
                        variant="h5"
                        component="div"
                      >
                        Gen Two's Staking!
                      </Typography>
                    </Grid>
                    {nftsSelection[1].map((nft, nftIndex) => (
                      <Grid item key={nftIndex}>
                        <Box textAlign="center">
                          <StyledCard>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <CardMedia
                                component="img"
                                height="140"
                                image={
                                  // @ts-ignore
                                  nft.offchainMetadata.hasOwnProperty("image")
                                    ? // @ts-ignore
                                      nft.offchainMetadata.image
                                    : "https://www.arweave.net/GLeORZQuLxFzDFK0aBQKwhQUUF0-4eawXnrjdtmv5fg?ext=png"
                                }
                              />
                            </div>
                            <CardContent>
                              <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                              >
                                {
                                  // @ts-ignore
                                  nft.name
                                }
                              </Typography>
                            </CardContent>
                          </StyledCard>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </StyledCard>
              </Box>
            </Grid>
          )}
        </Grid>
      </StyledCard>
    </>
  );
};
