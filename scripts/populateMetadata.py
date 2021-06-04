from absl import app
from absl import flags
from tflite_support.metadata_writers import image_classifier
from tflite_support.metadata_writers import writer_utils

ImageClassifierWriter = image_classifier.MetadataWriter


def define_flags():
    flags.DEFINE_string("model_file", None, "The input model path")
    flags.DEFINE_string("label_file", None, "The input labels path")
    flags.DEFINE_string("output_file", None, "The output model path")
    flags.mark_flag_as_required("model_file")
    flags.mark_flag_as_required("label_file")
    flags.mark_flag_as_required("output_file")


def main(_):
    writer = ImageClassifierWriter.create_for_inference(
        writer_utils.load_file(flags.FLAGS.model_file),
        [127.5],
        [127.5],
        [flags.FLAGS.label_file]
    )

    writer_utils.save_file(writer.populate(), flags.FLAGS.output_file)

    print(writer.get_metadata_json())


if __name__ == "__main__":
    define_flags()
    app.run(main)
